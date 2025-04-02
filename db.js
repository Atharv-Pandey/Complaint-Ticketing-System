const mongoose = require('mongoose');

function connect() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    
    mongoose.connect('mongodb://localhost/complaintapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
}

module.exports = connect;
