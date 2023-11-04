const User = require("../models/User");
const Appointment = require("../models/Appointment");
var CryptoJS = require("crypto-js");

exports.examinerPage = async (req, res) => {
    try {
        User.find({ "userType": "Driver" }).populate("AppointmentId").sort({ _id: -1 })
            .then(async (result) => {
                res.render('examiner', {
                    data: result,
                    userType: req.session.user_UserType
                })
            }).catch((err) => {
                console.log("ee", err);
            })
    } catch (err) {
        console.log("appoinment err", err);
    }
}

exports.viewDriverDetail = async (req, res) => {
    try {

        var data = await User.findOne({ "_id": req.params.id });

        if (data.AppointmentId) {
            let appointment = await Appointment.findOne({
                "_id": data.AppointmentId,
            }, { "_id": 1, "Time": 1, "Date": 1 })

            let timeSlot = appointment["Time"].split(":");
            data.hrs = timeSlot[0];
            data.minutes = timeSlot[1];
            data.date = appointment.Date;
        }

        res.render('driverDetail', {
            user: data,
            userType: req.session.user_UserType
        })
    } catch (err) {
        console.log("view driver detail err", err);
    }
}

exports.submitTestResult = async (req, res) => {
    try {
        User.update({ "_id": req.body.id }, { comment: req.body.comment, Pass: req.body.pass }).then(async (result) => {
            var resultData = await User.findOne({ "_id": req.body.id }).lean();

            if (resultData.AppointmentId) {
                let appointment = await Appointment.findOne({
                    "_id": resultData.AppointmentId,
                }, { "_id": 1, "Time": 1, "Date": 1 })

                let timeSlot = appointment["Time"].split(":");
                resultData.hrs = timeSlot[0];
                resultData.minutes = timeSlot[1];
                resultData.date = appointment.Date;
            }

            return res.render('driverDetail', {
                user: resultData,
                userType: req.session.user_UserType
            })
        }).catch(err => {
            console.log("updatederr", err);
        });
    } catch (err) {
        console.log("submit driver detail err", err);
    }
}