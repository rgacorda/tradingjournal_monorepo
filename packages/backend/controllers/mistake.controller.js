const { Mistake } = require("../models");

exports.getAllMistakes = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const mistakes = await Mistake.findAll({
      where: {
        userId,
      },
      order: [["name", "ASC"]],
    });
    res.status(200).json(mistakes);
  } catch (err) {
    console.error("Error fetching mistakes:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch mistakes", error: err.message });
  }
};

exports.getMistake = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const mistake = await Mistake.findByPk(id);
    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }

    // Verify ownership
    if (mistake.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only view your own mistakes" });
    }

    res.status(200).json(mistake);
  } catch (err) {
    console.error("Error fetching mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch mistake", error: err.message });
  }
};

exports.createMistake = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Mistake name is required" });
  }

  try {
    // Check if mistake with same name already exists for this user
    const existingMistake = await Mistake.findOne({
      where: {
        name: name.trim(),
        userId,
      },
    });

    if (existingMistake) {
      return res.status(409).json({
        message: "A mistake with this name already exists",
        mistake: existingMistake,
      });
    }

    const mistake = await Mistake.create({
      name: name.trim(),
      userId,
    });
    res.status(201).json(mistake);
  } catch (err) {
    console.error("Error creating mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to create mistake", error: err.message });
  }
};

exports.updateMistake = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Mistake name is required" });
  }

  try {
    const mistake = await Mistake.findByPk(id);
    if (!mistake) {
      return res.status(404).json({ message: "Mistake not found" });
    }

    // Verify ownership
    if (mistake.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own mistakes" });
    }

    // Check if another mistake with same name exists for this user
    const existingMistake = await Mistake.findOne({
      where: {
        name: name.trim(),
        userId,
        id: { [require("sequelize").Op.ne]: id }, // Exclude current mistake
      },
    });

    if (existingMistake) {
      return res
        .status(409)
        .json({ message: "A mistake with this name already exists" });
    }

    await mistake.update({ name: name.trim() });
    res.status(200).json(mistake);
  } catch (err) {
    console.error("Error updating mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to update mistake", error: err.message });
  }
};

exports.deleteMistake = async (req, res) => {
  const { ids } = req.body;
  const { id: userId } = req.user;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No mistake IDs provided" });
  }

  try {
    // Only delete mistakes that belong to the user
    const deletedCount = await Mistake.destroy({
      where: {
        id: ids,
        userId: userId,
      },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No matching mistakes found or unauthorized" });
    }

    res.status(200).json({
      message: `${deletedCount} mistake(s) deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting mistake:", err);
    res
      .status(500)
      .json({ message: "Failed to delete mistake", error: err.message });
  }
};

exports.getMistakeAnalytics = async (req, res) => {
  const { id: userId } = req.user;
  const { Trade } = require("../models");
  const { sequelize } = require("../models");
  const { QueryTypes } = require("sequelize");

  try {
    // Get all mistakes for the user
    const mistakes = await Mistake.findAll({
      where: { userId },
      include: [
        {
          model: Trade,
          as: "Trades",
          attributes: ["id", "grade", "realized", "date"],
        },
      ],
    });

    // Calculate analytics for each mistake
    const analytics = await Promise.all(
      mistakes.map(async (mistake) => {
        const trades = mistake.Trades || [];

        // Frequency Analysis
        const frequency = trades.length;
        const totalTrades = await Trade.count({ where: { userId } });
        const percentageOfTrades =
          totalTrades > 0 ? ((frequency / totalTrades) * 100).toFixed(2) : 0;

        // Recency Tracking
        let lastOccurrence = null;
        let daysSinceLastOccurrence = null;

        if (trades.length > 0) {
          const sortedTrades = trades.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          lastOccurrence = sortedTrades[0].date;

          const today = new Date();
          const lastDate = new Date(lastOccurrence);
          const diffTime = Math.abs(today - lastDate);
          daysSinceLastOccurrence = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Grade Impact Analysis
        const tradesWithGrades = trades.filter((t) => t.grade !== null);
        const averageGrade =
          tradesWithGrades.length > 0
            ? (
                tradesWithGrades.reduce((sum, t) => sum + t.grade, 0) /
                tradesWithGrades.length
              ).toFixed(2)
            : null;

        // Get average grade for all user's trades (for comparison)
        const allTradesWithGrades = await Trade.findAll({
          where: {
            userId,
            grade: { [require("sequelize").Op.ne]: null },
          },
          attributes: ["grade"],
        });

        const overallAverageGrade =
          allTradesWithGrades.length > 0
            ? (
                allTradesWithGrades.reduce((sum, t) => sum + t.grade, 0) /
                allTradesWithGrades.length
              ).toFixed(2)
            : null;

        const gradeImpact =
          averageGrade && overallAverageGrade
            ? (averageGrade - overallAverageGrade).toFixed(2)
            : null;

        // Financial Impact
        const totalPnL = trades
          .reduce((sum, t) => sum + parseFloat(t.realized || 0), 0)
          .toFixed(2);
        const averagePnL =
          trades.length > 0 ? (totalPnL / trades.length).toFixed(2) : 0;

        return {
          mistakeId: mistake.id,
          mistakeName: mistake.name,
          frequency: {
            count: frequency,
            percentageOfTrades: parseFloat(percentageOfTrades),
          },
          recency: {
            lastOccurrence,
            daysSinceLastOccurrence,
          },
          gradeAnalysis: {
            averageGrade: averageGrade ? parseFloat(averageGrade) : null,
            overallAverageGrade: overallAverageGrade
              ? parseFloat(overallAverageGrade)
              : null,
            gradeImpact: gradeImpact ? parseFloat(gradeImpact) : null,
            tradesWithGrades: tradesWithGrades.length,
          },
          financialImpact: {
            totalPnL: parseFloat(totalPnL),
            averagePnL: parseFloat(averagePnL),
          },
        };
      })
    );

    // Sort by frequency (most common mistakes first)
    analytics.sort((a, b) => b.frequency.count - a.frequency.count);

    res.status(200).json({
      analytics,
      summary: {
        totalMistakes: mistakes.length,
        totalTrades: await Trade.count({ where: { userId } }),
        tradesWithMistakes: await Trade.count({
          where: { userId },
          include: [
            {
              model: Mistake,
              as: "Mistakes",
              required: true,
            },
          ],
        }),
      },
    });
  } catch (err) {
    console.error("Error fetching mistake analytics:", err);
    res.status(500).json({
      message: "Failed to fetch mistake analytics",
      error: err.message,
    });
  }
};
