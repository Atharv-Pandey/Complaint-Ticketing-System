const User = require('../models/User');

exports.getEngineers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can access this' });
    }
    
    const engineers = await User.find({ role: 'junior_engineer' }, 'name username email contact');
    res.json(engineers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
