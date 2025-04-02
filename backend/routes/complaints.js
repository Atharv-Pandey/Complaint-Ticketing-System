const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createComplaint,
  getComplaint,
  getComplaints,
  assignComplaint,
  updateComplaintStatus,
  getAssignedComplaints
} = require('../controllers/complaints');

router.get('/assigned', auth, getAssignedComplaints);
router.get('/', auth, getComplaints);
router.get('/:id', auth, getComplaint);
router.put('/:id/assign', auth, assignComplaint);
router.put('/:id/status', auth, updateComplaintStatus);
router.post('/', auth, createComplaint);

module.exports = router;
