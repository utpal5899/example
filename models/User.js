var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Appointment = require("../models/Appointment");

var UserSchema = new Schema({
    firstname: {
        type: String,
        default: null,
    },
    lastname: {
        type: String,
        default: null,
    },
    username: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    LicenseNo: {
        type: String,
        default: null,
    },
    userType: {
        type: String,
        default: null,
    },
    Age: {
        type: Number,
        deafult: null,
    },
    car_details: {
        type: Object,
        deafult: null,
    },
    AppointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    },
    TestType: {
        type: String,
        default: null
    },
    Pass: {
        type: Boolean,
        default: null
    },
    comment: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    }

});

module.exports = mongoose.model('User', UserSchema);