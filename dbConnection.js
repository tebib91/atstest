const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost/myDb';

module.exports = function () {
    mongoose.connect(dbURL, { useNewUrlParser: true,  useUnifiedTopology: true });

    mongoose.connection.on('connected', function() {
        console.log("Successfully connected to database");
    });

    mongoose.connection.on('error', function(err) {
        console.log("failed to connect to database: " + err);
    });

    mongoose.connection.on('disconnected', function() {
        console.log("connection to database disconnected");
    });

    return mongoose.connection;
};