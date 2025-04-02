const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['submitted', 'assigned', 'in_progress', 'resolved', 'rejected'], 
    default: 'submitted' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
