const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');
let Complaint = require('../models/complaint');
let ComplaintMapping = require('../models/complaint-mapping');

// Home Page - Dashboard
router.get('/', ensureAuthenticated, (req, res, next) => {
    if (req.user.role === 'admin') {
      return res.redirect('/admin');
    }
    if (req.user.role === 'jeng') {
      return res.redirect('/jeng');
    }
    // Fetch user's complaints for the home page
    Complaint.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(3) // Show only 3 most recent on home page
    .exec((err, complaints) => {
      if (err) {
        req.flash('error_msg', 'Error loading complaints');
        return res.redirect('/');
      }
      res.render('index', {
        user: req.user,
        complaints: complaints // Pass complaints to home page
      });
    });
});

// Login Form
router.get('/login', (req, res, next) => {
    res.render('login');
});

// Register Form
router.get('/register', (req, res, next) => {
    res.render('register');
});

// Logout
router.get('/logout', ensureAuthenticated,(req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

// Admin
const async = require('async'); // Add this at the top with other requires

router.get('/admin', ensureAuthenticated, ensureRole('admin'), (req, res, next) => {
  // Get counts for each status in parallel
  Promise.all([
    Complaint.countDocuments({ status: 'Pending' }),
    Complaint.countDocuments({ status: 'In Progress' }),
    Complaint.countDocuments({ status: 'Resolved' }),
    User.countDocuments({ role: 'jeng' }),
    Complaint.find({}).sort({ createdAt: -1 }).lean(),
    User.find({ role: 'jeng' }).lean()
  ])
  .then(([pending, inProgress, resolved, engineers, complaints, jeng]) => {
    
    // Get assignments for all complaints
    const complaintIds = complaints.map(c => c._id);
    
    return ComplaintMapping.find({ 
      complaintID: { $in: complaintIds } 
    }).lean()
      .then(mappings => {
        // Add assignedTo to each complaint
        const complaintsWithAssignments = complaints.map(complaint => {
          const mapping = mappings.find(m => m.complaintID.equals(complaint._id));
          return {
            ...complaint,
            assignedTo: mapping ? mapping.engineerName : null
          };
        });

        return {
          complaints: complaintsWithAssignments,
          jeng: jeng,
          stats: {
            pending,
            inProgress,
            resolved,
            engineers
          }
        };
      });
  })
  .then(results => {
    res.render('admin/admin', results);
  })
  .catch(err => {
    console.error('Admin dashboard error:', err);
    req.flash('error_msg', 'Error loading admin dashboard');
    res.redirect('/');
  });
});

//
router.post('/assign', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
      const { complaintID, engineerName } = req.body;
      
      // Verify the complaint exists
      const complaint = await Complaint.findById(complaintID);
      if (!complaint) {
        return res.status(404).json({ 
          success: false,
          message: 'Complaint not found' 
        });
      }
      
      // Check if engineer exists
      const engineer = await User.findOne({ 
        username: engineerName, 
        role: 'jeng' 
      });
      if (!engineer) {
        return res.status(404).json({ 
          success: false,
          message: 'Engineer not found' 
        });
      }
      
      // Create or update assignment
      await ComplaintMapping.findOneAndUpdate(
        { complaintID: complaintID },
        { engineerName: engineerName },
        { upsert: true, new: true }
      );
      
      // Update complaint status if it was pending
      if (complaint.status === 'Pending') {
        await Complaint.findByIdAndUpdate(complaintID, {
          status: 'In Progress',
          $push: {
            updates: {
              status: 'In Progress',
              changedBy: req.user._id,
              comment: `Assigned to ${engineerName}`
            }
          }
        });
      }
      
      res.json({ 
        success: true,
        message: `Complaint assigned to ${engineerName}` 
      });
      
    } catch (err) {
      console.error('Assignment error:', err);
      res.status(500).json({ 
        success: false,
        message: 'Assignment failed' 
      });
    }
});

// Junior Eng
router.get('/jeng', ensureAuthenticated, ensureRole('jeng'), (req, res, next) => {
    // Clear any duplicate flash messages
    req.flash('success_msg', null);
    req.flash('error_msg', null);

    ComplaintMapping.find({ engineerName: req.user.username }, (err, mappings) => {
        if (err) return next(err);

        if (!mappings || mappings.length === 0) {
            return res.render('junior/junior', {
                complaints: [],
                user: req.user,
                assignedCount: 0,
                inProgressCount: 0,
                resolvedCount: 0
            });
        }

        const complaintIds = mappings.map(m => m.complaintID);

        Promise.all([
            Complaint.find({ '_id': { $in: complaintIds } }),
            Complaint.countDocuments({ '_id': { $in: complaintIds }, status: 'In Progress' }),
            Complaint.countDocuments({ '_id': { $in: complaintIds }, status: 'Resolved' })
        ])
        .then(([complaints, inProgressCount, resolvedCount]) => {
            res.render('junior/junior', {
                complaints: complaints,
                user: req.user,
                assignedCount: complaints.length,
                inProgressCount: inProgressCount,
                resolvedCount: resolvedCount
            });
        })
        .catch(err => next(err));
    });
});

//Complaint
router.get('/complaint', ensureAuthenticated, (req, res, next) => {
    //console.log(req.session.passport.username);
    //console.log(user.name);
    res.render('complaint', {
        username: req.session.user,
    });
});

//Register a Complaint
router.post('/registerComplaint', (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const desc = req.body.desc;
    
    const postBody = req.body;
    console.log(postBody);

    req.checkBody('contact', 'Contact field is required').notEmpty();
    req.checkBody('desc', 'Description field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('complaint', {
            errors: errors
        });
    } else {
        const newComplaint = new Complaint({
            name: name,
            email: email,
            contact: contact,
            desc: desc,
            user: req.user._id,  // Link to user
            updates: [{
                status: 'Submitted',
                changedBy: req.user._id,
                comment: 'Complaint submitted'
            }]
        });

        Complaint.registerComplaint(newComplaint, (err, complaint) => {
            if (err) throw err;
            
            // Add complaint to user's complaint history
            User.findByIdAndUpdate(
                req.user._id,
                { $push: { complaints: complaint._id }},
                { new: true },
                (err) => {
                    if (err) throw err;
                    req.flash('success_msg', 'Complaint submitted successfully');
                    res.redirect('/my-complaints');
                }
            );
        });
    }
});



// Process Register
router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('role', 'Role option is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password,
            role: role
        });

        User.registerUser(newUser, (err, user) => {
            if (err) throw err;
            req.flash('success_msg', 'You are Successfully Registered and can Log in');
            res.redirect('/login');
        });
    }
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'No user found'
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Wrong Password'
                });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    var sessionUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
    }
    done(null, sessionUser);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, sessionUser) => {
        done(err, sessionUser);
    });
});

// Login Processing
router.post('/login', passport.authenticate('local', 
    { 
        failureRedirect: '/login', 
        failureFlash: true 
    
    }), (req, res, next) => {
    
        req.session.save((err) => {
        if (err) {
            return next(err);
        }
        if(req.user.role==='admin'){
            res.redirect('/admin');
        }
        else if(req.user.role==='jeng'){
            res.redirect('/jeng');
        }
        else{
            res.redirect('/');
        }
    });
});

// Add this to routes/index.js after the existing routes

// Junior Eng Dashboard - Show assigned complaints
router.get('/jeng', ensureAuthenticated, (req,res,next) => {
    // Find all complaints assigned to this engineer
    ComplaintMapping.find({engineerName: req.user.username}, (err, mappings) => {
        if (err) throw err;
        
        // Extract the complaint IDs from the mappings
        const complaintIds = mappings.map(mapping => mongoose.Types.ObjectId(mapping.complaintID));
        
        // Find all complaints with these IDs
        Complaint.find({'_id': { $in: complaintIds }}, (err, complaints) => {
            if (err) throw err;
            
            res.render('junior/junior', {
                complaints: complaints,
                user: req.user
            });
        });
    });
});

// User Complaint History
router.get('/my-complaints', ensureAuthenticated, ensureRole('user'), (req, res) => {
    Complaint.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('updates.changedBy', 'name role')
        .exec((err, complaints) => {
            if (err) {
                console.error(err);
                req.flash('error_msg', 'Error loading complaints');
                return res.redirect('/');
            }
            
            res.render('user/complaints', {
                complaints: complaints,
                statusColors: {
                    'Submitted': 'primary',
                    'In Progress': 'warning',
                    'Resolved': 'success',
                    'Rejected': 'danger'
                }
            });
        });
});

// Complaint Details
router.get('/complaint/:id', ensureAuthenticated, (req, res) => {
    Complaint.findOne({ 
        _id: req.params.id,
        user: req.user._id 
    })
    .populate('updates.changedBy', 'name role')
    .exec((err, complaint) => {
        if (err || !complaint) {
            req.flash('error_msg', 'Complaint not found');
            return res.redirect('/my-complaints');
        }
        
        res.render('user/complaint-details', {
            complaint: complaint,
            statusColors: {
                'Submitted': 'primary',
                'In Progress': 'warning',
                'Resolved': 'success',
                'Rejected': 'danger'
            }
        });
    });
});

// Update Complaint Status
router.post('/update-status', ensureAuthenticated, (req, res, next) => {
    const complaintId = req.body.complaintId;
    const status = req.body.status;
    const comment = req.body.comment || '';

    const update = {
        status: status,
        $push: {
            updates: {
                status: status,
                changedBy: req.user._id,
                comment: comment,
                timestamp: new Date()
            }
        }
    };

    Complaint.findByIdAndUpdate(
        complaintId,
        update,
        { new: true },
        (err, updatedComplaint) => {
            if (err) {
                console.error('Error updating status:', err);
                req.flash('error_msg', 'Error updating complaint status');
                return res.redirect('/jeng');
            }
            
            // Only set one success message
            req.flash('success_msg', 'Complaint status updated successfully');
            res.redirect('/jeng');
        }
    );
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not Authorized to view this page');
        res.redirect('/login');
    }
}

function ensureRole(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      }
      req.flash('error_msg', 'You are not authorized to view this page');
      res.redirect('/');
    }
}

module.exports = router;
