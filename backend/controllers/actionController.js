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

exports.getLastActions = async (req, res) => {
  try {
    const actions = await Action.find()
      .populate("user", "username")
      .populate("task", "title")
      .sort({ timestamp: -1 })
      .limit(20);

    const formatted = actions.map(act => ({
      message: `${act.user?.username || 'Unknown User'} ${act.actionType} "${act.task?.title || 'Deleted Task'}"`,
      time: act.timestamp
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch actions", error: err.message });
  }
};
