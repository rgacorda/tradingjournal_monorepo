const { Plan, Trade } = require("../models");
const { Sequelize } = require("sequelize");

exports.getAllPlans = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const plans = await Plan.findAll({
      where: {
        userId,
      },
    });
    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch plans", error: err.message });
  }
};

exports.getPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (err) {
    console.error("Error fetching plan:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch plan", error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  const { name, content } = req.body;
  const { id: userId } = req.user;

  try {
    const plan = await Plan.create({ name, content, userId });
    res.status(201).json(plan);
  } catch (err) {
    console.error("Error creating plan:", err);
    res
      .status(500)
      .json({ message: "Failed to create plan", error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.content) updateData.content = req.body.content;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.update(updateData);
    await plan.save();
    res.status(200).json(plan);
  } catch (err) {
    console.error("Error updating plan:", err);
    res
      .status(500)
      .json({ message: "Failed to update plan", error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.destroy();
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Error deleting plan:", err);
    res
      .status(500)
      .json({ message: "Failed to delete plan", error: err.message });
  }
};

exports.getPlanStatistics = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const plans = await Plan.findAll({
      where: { userId },
      attributes: ["id", "name"],
    });

    const statistics = await Promise.all(
      plans.map(async (plan) => {
        const trades = await Trade.findAll({
          where: { planId: plan.id, userId },
          include: [
            {
              model: require("../models").Account,
              as: "Account",
              where: {
                isAnalyticsIncluded: true,
              },
              attributes: ["id", "isCommissionsIncluded"],
            },
          ],
        });

        const numberOfTrades = trades.length;

        if (numberOfTrades === 0) {
          return {
            planId: plan.id,
            planName: plan.name,
            totalPnL: 0,
            winRate: 0,
            averageRR: 0,
            expectancy: 0,
            numberOfTrades: 0,
          };
        }

        // Helper function to get adjusted realized value (accounting for commissions)
        const getAdjustedRealized = (trade) => {
          const realized = parseFloat(trade.realized);
          const fees = parseFloat(trade.fees) || 0;
          const isCommissionsIncluded = trade.Account?.isCommissionsIncluded;
          return isCommissionsIncluded ? realized - fees : realized;
        };

        // Calculate total PnL with commission adjustments
        const totalPnL = trades.reduce((sum, trade) => {
          return sum + getAdjustedRealized(trade);
        }, 0);

        // Calculate win rate using adjusted realized
        const wins = trades.filter(
          (trade) => getAdjustedRealized(trade) > 0
        ).length;
        const winRate = (wins / numberOfTrades) * 100;

        // Calculate average RR (Risk/Reward)
        const rrValues = trades.map((trade) => {
          const entry = parseFloat(trade.entry);
          const exit = parseFloat(trade.exit);
          const adjustedRealized = getAdjustedRealized(trade);

          // Calculate potential risk based on entry/exit
          const priceChange = Math.abs(exit - entry);

          if (adjustedRealized > 0) {
            // Winning trade - reward is the realized profit
            const reward = Math.abs(adjustedRealized);
            // Risk estimation: assume they risked the opposite movement
            const risk = priceChange * parseFloat(trade.quantity);
            return risk > 0 ? reward / risk : 0;
          } else if (adjustedRealized < 0) {
            // Losing trade - risk is the realized loss
            const risk = Math.abs(adjustedRealized);
            // Reward estimation: what they were aiming for
            const reward = priceChange * parseFloat(trade.quantity);
            return risk > 0 ? reward / risk : 0;
          }
          return 0;
        });

        const validRR = rrValues.filter((rr) => rr > 0);
        const averageRR =
          validRR.length > 0
            ? validRR.reduce((sum, rr) => sum + rr, 0) / validRR.length
            : 0;

        // Calculate expectancy using adjusted realized values
        const losses = numberOfTrades - wins;
        const lossRate = losses / numberOfTrades;

        const avgWin =
          wins > 0
            ? trades
                .filter((t) => getAdjustedRealized(t) > 0)
                .reduce((sum, t) => sum + getAdjustedRealized(t), 0) / wins
            : 0;

        const avgLoss =
          losses > 0
            ? Math.abs(
                trades
                  .filter((t) => getAdjustedRealized(t) < 0)
                  .reduce((sum, t) => sum + getAdjustedRealized(t), 0) / losses
              )
            : 0;

        const expectancy = (winRate / 100) * avgWin - lossRate * avgLoss;

        return {
          planId: plan.id,
          planName: plan.name,
          totalPnL: parseFloat(totalPnL.toFixed(2)),
          winRate: parseFloat(winRate.toFixed(2)),
          averageRR: parseFloat(averageRR.toFixed(2)),
          expectancy: parseFloat(expectancy.toFixed(2)),
          numberOfTrades,
        };
      })
    );

    res.status(200).json(statistics);
  } catch (err) {
    console.error("Error fetching plan statistics:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch plan statistics", error: err.message });
  }
};
