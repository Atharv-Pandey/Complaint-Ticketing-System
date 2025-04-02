const mongoose = require('mongoose')
const dbconnect = require('../db')

//Call the db to connect the mongo db
dbconnect()

// models/complaint-mapping.js
const ComplaintMappingSchema = mongoose.Schema({
    complaintID: {
        type: mongoose.Schema.Types.ObjectId,  // Changed from String
        ref: 'Complaint',  // Reference to Complaint model
        required: true
    },
    engineerName: {
        type: String,
        required: true
    }
});

// Add a compound index
ComplaintMappingSchema.index({ complaintID: 1, engineerName: 1 });

const ComplaintMapping = module.exports = mongoose.model('ComplaintMapping', ComplaintMappingSchema);

module.exports.registerMapping = function (newComplaintMapping, callback) {
    newComplaintMapping.save(callback);
}

// Add this method to the model
module.exports.getComplaintsByEngineer = function(engineerName, callback) {
    this.find({ engineerName: engineerName })
        .populate('complaint')  // This requires changing the schema slightly
        .exec(callback);
};
