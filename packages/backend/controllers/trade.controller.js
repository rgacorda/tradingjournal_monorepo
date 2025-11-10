const { Trade } = require("../models");

exports.getAllTrades = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const trades = await Trade.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: require("../models").Account,
          as: "Account",
          where: {
            isAnalyticsIncluded: true,
          },
          attributes: [], 
        },
      ],
    });
    const sortedTrades = trades.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(sortedTrades);
  } catch (err) {
    console.error("Error fetching trades:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch trades", error: err.message });
  }
};

exports.getTrade = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Verify ownership
    if (trade.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only view your own trades" });
    }

    res.status(200).json(trade);
  } catch (err) {
    console.error("Error fetching trade:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch trade", error: err.message });
  }
};

exports.createTrade = async (req, res) => {
  const {
    ticker,
    side,
    quantity,
    entry,
    exit,
    account,
    accountId,
    realized,
    time,
    date,
    fees,
    grade,
    mistakes,
    notes,
    planId,
    security,
    broker
  } = req.body;
  const { id: userId } = req.user;

  // Validate required fields
  if (!ticker || !side || !quantity || !entry || !exit || !date || !time || !account) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const trade = await Trade.create({
      ticker,
      side,
      quantity,
      entry,
      exit,
      account,
      accountId: accountId || null,
      realized: realized || 0,
      time,
      date,
      fees: fees || 0,
      grade: grade || null,
      mistakes: mistakes || null,
      notes: notes || null,
      planId: planId || null,
      security: security || 'stock',
      broker: broker || null,
      userId,
    });
    res.status(201).json(trade);
  } catch (err) {
    console.error("Error creating trade:", err);
    res
      .status(500)
      .json({ message: "Failed to create trade", error: err.message });
  }
};

exports.updateTrade = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const {
    ticker,
    side,
    quantity,
    entry,
    exit,
    account,
    accountId,
    realized,
    time,
    date,
    grade,
    planId,
    mistakes,
    fees,
    notes,
    security,
    broker
  } = req.body;

  const updateData = {};

  if (ticker !== undefined) updateData.ticker = ticker;
  if (side !== undefined) updateData.side = side;
  if (quantity !== undefined) updateData.quantity = quantity;
  if (entry !== undefined) updateData.entry = entry;
  if (exit !== undefined) updateData.exit = exit;
  if (account !== undefined) updateData.account = account;
  if (accountId !== undefined) updateData.accountId = accountId;
  if (realized !== undefined) updateData.realized = realized;
  if (time !== undefined) updateData.time = time;
  if (date !== undefined) updateData.date = date;
  if (grade !== undefined) updateData.grade = grade;
  if (planId !== undefined) updateData.planId = planId;
  if (mistakes !== undefined) updateData.mistakes = mistakes;
  if (fees !== undefined) updateData.fees = fees;
  if (notes !== undefined) updateData.notes = notes;
  if (security !== undefined) updateData.security = security;
  if (broker !== undefined) updateData.broker = broker;

  try {
    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Verify ownership
    if (trade.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only update your own trades" });
    }

    await trade.update(updateData);
    res.status(200).json(trade);
  } catch (err) {
    console.error("Error updating trade:", err);
    res
      .status(500)
      .json({ message: "Failed to update trade", error: err.message });
  }
};

exports.deleteTrade = async (req, res) => {
  const { ids } = req.body;
  const { id: userId } = req.user;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No trade IDs provided" });
  }

  try {
    // Only delete trades that belong to the user
    const deletedCount = await Trade.destroy({
      where: {
        id: ids,
        userId: userId, // Ensure user can only delete their own trades
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "No matching trades found or unauthorized" });
    }

    res.status(200).json({
      message: `${deletedCount} trade(s) deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting trade:", err);
    res
      .status(500)
      .json({ message: "Failed to delete trade", error: err.message });
  }
};
