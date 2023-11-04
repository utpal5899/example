const User = require("../models/User");
const Appointment = require("../models/Appointment");
var bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");
const { MongoClient, ObjectId } = require('mongodb');

exports.signinPage = (req, res) => {
    res.render('login', { userType: req.session.user_UserType })
}

exports.signupPage = (req, res) => {
    res.render('signup', { userType: req.session.user_UserType })
}

exports.dashboard = (req, res) => {
    res.render('dashboard', { userType: req.session.user_UserType })
}

exports.signup = (req, res) => {
    
    User.findOne({
        username: req.body.username,
    }).then((user) => {
        if (!user) {
            var bindata = req.body.profile_pic;

            const user = new User({
                firstname: "hjh",
                lastname: "hgg",
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
                userType: req.body.userType,
                LicenseNo: CryptoJS.AES.encrypt('default', 'secretkey123').toString(),
                profilePic: bindata,
                car_details: {
                    make: "mercedes-maybach",
                    model: "X1",
                    year: "2023",
                    plateno: "jhgjhk"
                }
            });

            user.save((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    console.log({ user })
                    res.send({ message: "Your account is registered successfully, You can login to website now" });
                }
            });
        } else {
            res.json({
                message: "Username already Exist, Please use another username",
                error: "Username already Exist, Please use another username"

            });
        }
    });
}

exports.signin = (req, res) => {

    console.log(req.body)  
    User.findOne({
        username: req.body.username,
        userType: req.body.userType,

    }).then((user) => {
        if (!user) {
            return res.json({ message: ["Invalid credentials."], error: "Invalid jdrgndljgndlkgdcredentials, Please use signup if you don't have account", userType: req.session.userType });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.json({ message: ["Invalid credentials."], error: "Invalid credentials, Please use signup if you don't have account", userType: req.session.userType });
        }

        req.session.user_id = user.id;
        req.session.user_UserType = user.userType;
        return res.json({ "sucess": true });
    });
};


exports.gPage = async (req, res) => {
    var data = await User.findOne({ "_id": req.session.user_id });

    {
        let appointment = await Appointment.findOne({
            "_id": data.AppointmentId,
        }, { "_id": 1, "Time": 1, "Date": 1 })

        let timeSlot = appointment["Time"].split(":");
        data.hrs = timeSlot[0];
        data.minutes = timeSlot[1];
        data.date = appointment.Date;
    }

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(data.LicenseNo, 'secretkey123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (originalText == "default") {
        res.render('G2', {
            user: data,
            userType: req.session.user_UserType,
            defaultValue: true,
            licenseno: '',

        })
    } else {
        res.render('G', {
            user: data,
            userType: req.session.user_UserType
        })
    }
}

exports.g3Page = async (req, res) => {
    if (req.body.id) {
        var newObj = {
            make: req.body.make,
            model: req.body.modelno,
            year: req.body.year,
            plateno: req.body.plateno
        }

        return User.update({ "_id": req.body.id }, { TestType: "G", car_details: newObj }).then(async (result) => {
            var resultData = await User.findOne({ "_id": req.body.id }).lean();

            let appointment = await Appointment.findOne({
                "_id": resultData.AppointmentId,
            }, { "_id": 1, "Time": 1, "Date": 1 })

            let timeSlot = appointment["Time"].split(":");
            resultData.hrs = timeSlot[0];
            resultData.minutes = timeSlot[1];
            resultData.date = appointment.Date;

            return res.json({
                user: resultData,
                licenseno: true,
                userType: req.session.user_UserType,
                message: "Detail Updated Successfully!!"
            })
        }).catch(err => {
            console.log("updatederr", err);
        });
    }
    else
        res.render('G', { userObj: [], licenseno: false })
}

exports.g2Page = async (req, res) => {
    var resultData = await User.findOne({ "_id": req.session.user_id }).lean();

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(resultData.LicenseNo, 'secretkey123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (originalText == "default") {
        res.render('G2', {
            msg: false, userType: req.session.user_UserType,
            user: resultData, defaultValue: true,
            licenseno: ""
        })
    } else {
        let appointment = await Appointment.findOne({
            "_id": resultData.AppointmentId,
        }, { "_id": 1, "Time": 1, "Date": 1 })

        let timeSlot = appointment["Time"].split(":");
        resultData.hrs = timeSlot[0];
        resultData.minutes = timeSlot[1];
        resultData.date = appointment.Date;

        res.render('G2', {
            msg: false, userType: req.session.user_UserType, user: resultData,
            defaultValue: '',
            licenseno: originalText,
        })
    }
}

exports.submitDetail = async (req, res) => {

    var appointmentId = await Appointment.findOne({
        Date: req.body.date,
        Time: `${req.body.hrs}:${req.body.minutes}`
    });

    if (appointmentId == null) {
        return res.json({ message: ["Invalid slot."], error: "Please select a valid appointment slot", userType: req.session.userType });
    } else {
        var userObj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            LicenseNo: CryptoJS.AES.encrypt(req.body.licenseno, 'secretkey123').toString(),
            Age: req.body.Age,
            AppointmentId: appointmentId != null ? appointmentId.id : null,
            TestType: "G2",
            car_details: {
                make: req.body.make,
                model: req.body.modelno,
                year: req.body.year,
                plateno: req.body.plateno
            }
        }

        User.updateOne({ _id: req.session.user_id }, userObj).then(async (result) => {
            var resultData = await User.findOne({ "_id": req.session.user_id }).lean();

            // Decrypt
            var bytes = CryptoJS.AES.decrypt(resultData.LicenseNo, 'secretkey123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            await Appointment.updateOne(
                { _id: ObjectId(appointmentId.id) },
                { $set: { isTimeSlotAvailable: false } }
            )

            resultData.hrs = req.body.hrs;
            resultData.minutes = req.body.minutes;

            return res.json({
                user: resultData,
                licenseno: originalText,
                userType: req.session.user_UserType,
                defaultValue: (originalText == "default") ? true : "",
                message: "Detail Updated Successfully!!"
            })
        }).catch(err => {
            console.log("updatederr", err);
        });
    }
}

exports.signout = async (req, res) => {
    try {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    } catch (err) {
        this.next(err);
    }
}

exports.appointmentPage = async (req, res) => {
    res.render('appointment', { userType: req.session.user_UserType, message: "" })
}


