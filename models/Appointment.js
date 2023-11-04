var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppointmentSchema = new Schema({
    Date: {
        type: String,
        default: null,
    },
    Time: {
        type: String,
        default: null,
    },
    isTimeSlotAvailable: {
        type: Boolean,
        default: true,
    },
    hrs: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);