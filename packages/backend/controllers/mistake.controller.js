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
