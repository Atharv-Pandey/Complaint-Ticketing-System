const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.createComplaint = async (req, res) => {
  try {
    console.log('Creating complaint with data:', req.body);
    
    const complaint = new Complaint({
      customer: req.user.id,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      contact: req.body.contact,
      description: req.body.description,
      status: 'submitted'
    });

    const savedComplaint = await complaint.save();
    console.log('Saved complaint:', savedComplaint);
    
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'user') {
      query.customer = req.user.id;
    } 
    else if (req.user.role === 'junior_engineer') {
      query.assignedTo = req.user.id;
    }
    
    const complaints = await Complaint.find(query)
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email');
      
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate('customer', 'name email')
      .populate('assignedTo', 'name');
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.assignComplaint = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can assign complaints' });
    }
    
    const { engineerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: engineerId, status: 'in_progress' },
      { new: true }
    ).populate('assignedTo', 'name');
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['in_progress', 'resolved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id },
      { status },
      { new: true }
    );
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found or not assigned to you' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
