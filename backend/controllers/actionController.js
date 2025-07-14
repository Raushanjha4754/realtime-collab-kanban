const Action = require('../models/Action');

exports.getActions = async (req, res) => {
  try {
    const actions = await Action.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('user', 'username email')
      .populate('task', 'title');
      
    res.json(actions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch actions', error: err.message });
  }
};
