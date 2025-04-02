const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createComplaint,
  getComplaints,
  assignComplaint,
  updateComplaintStatus,
  getAssignedComplaints
} = require('../controllers/complaints');

router.get('/', auth, getComplaints);
router.get('/assigned', auth, getAssignedComplaints);
router.put('/:id/assign', auth, assignComplaint);
router.put('/:id/status', auth, updateComplaintStatus);
router.post('/', auth, createComplaint);

module.exports = router;
