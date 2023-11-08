const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.appointmentPage = async (req, res) => {
    res.render('appointment', { userType: req.session.user_UserType, message: "" })
}

exports.submitAppointmentSlot = async (req, res) => {
    var slotObj = {
        Date: req.body.date,
        Time: `${req.body.hrs}:${req.body.minutes}`,
        hrs: req.body.hrs
    }

    var slot = new Appointment(slotObj)

    slot.save().then(async (result) => {
        return res.render('appointment', {
            slot: result,
            userType: req.session.user_UserType,
        })
    }).catch(err => {
        console.log("slotbookerr", err);
    });
}

exports.getAvailableHourSlots = async (req, res) => {
    var slotHours = ['hh', '00', '01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12', '13', '14',
        '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

    var hrs = [];

    try {
        Appointment.find({
            "Date": req.body.date
        }).then(async (result) => {
            slotHours.forEach(async (hr) => {
                hrs.push(`<option value=${hr}>${hr}</option>`)
            })
            res.json(hrs)
        }).catch((err) => {
            console.log("ee", err);
        })
    } catch (err) {
        console.log("slot available", err);
    }
}

exports.getAvailableSecondSlots = async (req, res) => {
    var slotMinutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
        '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43',
        '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54',
        '55', '56', '57', '58', '59', '60'];

    var minutes = [];

    try {
        Appointment.find({
            "Date": req.body.date,
            "hrs": req.body.hrs
        }, { "Time": 1, "_id": 0 }).then((result) => {
            var aldExistedMin = result.map((el) => el.Time.split(":")[1])

            slotMinutes.forEach((mint) => {
                if (aldExistedMin.includes(mint))
                    minutes.push(`<option value=${mint} disabled>${mint}</option>`)
                else
                    minutes.push(`<option value=${mint}>${mint}</option>`)
            })
            res.json(minutes)
        }).catch((err) => {
            console.log("ee", err);
        })
    } catch (err) {
        console.log("slot available", err);
    }
}

exports.getAvailableSlots = async (req, res) => {
    try {
        var hourSlotG2 = ["<option value=''>hh</option>"];
        var mintSlotG2 = ["<option value=''>mm</option>"];
        var addedHrSlot = [];
        var addedSecSlot = [];

        Appointment.find({
            "Date": req.body.date,
            "isTimeSlotAvailable": true
        }, { "Time": 1, "_id": 0 }).then(async (result) => {


            result.forEach(async (mint) => {
                var splited = mint.Time.split(":");
                if (!addedHrSlot.includes(splited[0])) {
                    hourSlotG2.push(`<option value=${splited[0]}>${splited[0]}</option>`)
                    addedHrSlot.push(splited[0])
                }

                if (!addedSecSlot.includes(splited[1])) {
                    mintSlotG2.push(`<option value=${splited[1]}>${splited[1]}</option>`)
                    addedSecSlot.push(splited[1])
                }
            })

            finalResult = {
                hourSlotG2, mintSlotG2
            }
            res.json(finalResult)
        }).catch((err) => {
            console.log("ee", err);
        })
    } catch (err) {
        console.log("availslotserr", err);
    }
}

exports.driverResultList = async (req, res) => {
    try {
        User.find({ "userType": "Driver" }).populate("AppointmentId").sort({ _id: -1 })
            .then(async (result) => {
                res.render('driverResult', {
                    data: result,
                    userType: req.session.user_UserType

               
                })
            }).catch((err) => {
                console.log("ee", err);
            })
    } catch (err) {
        console.log("driver result listuhiedweghfieuwfhjifhnrkfwreiuferfuhewifuekhjfiw", err);
    }
}