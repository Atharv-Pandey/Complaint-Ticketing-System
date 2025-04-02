const mongoose = require('mongoose')
const dbconnect = require('../db')

//Call the db to connect the mongo db
dbconnect()

// Complaint Schema
// Update Complaint Schema to include status
// models/complaint.js
const ComplaintSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    contact: {
        type: String
    },
    desc: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Submitted'
    },
    updates: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });  // Add this to include createdAt and updatedAt

// Add index for better performance
ComplaintSchema.index({ name: 1, status: 1 });

const Complaint = module.exports = mongoose.model('Complaint', ComplaintSchema);

module.exports.registerComplaint = function (newComplaint, callback) {
    newComplaint.save(callback);
}

module.exports.getAllComplaints = function(callback){
    Complaint.find(callback);
  }