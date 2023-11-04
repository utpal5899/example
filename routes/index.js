const controller = require("../controllers/main.controller");
const appointmentController = require("../controllers/appointment.controller");
const examinerController = require("../controllers/examiner.controller");

checkSession = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.render('login', { userType: "" })
    }
}

authMiddleware = (req, res, next) => {
    if (req.session.user_UserType == "Admin") {
        next();
    } else {
        res.render('dashboard', { userType: "" })
    }
}

authMiddlewareDriver = (req, res, next) => {
    if (req.session.user_UserType == "Driver") {
        next();
    } else {
        res.render('dashboard', { userType: "" })
    }
}

authMiddlewareExaminer = (req, res, next) => {
    if (req.session.user_UserType == "Examiner") {
        next();
    } else {
        res.render('dashboard', { userType: "" })
    }
}



module.exports = function (app) {

    app.get('/', controller.dashboard);

    app.post(
        "/signup", controller.signup
    );

    app.get('/login', controller.signinPage);

    app.post('/submit/login', controller.signin);
    app.get('/signup', controller.signupPage);
    app.get('/G', checkSession, authMiddlewareDriver, controller.gPage);
    app.post('/G3', checkSession, authMiddlewareDriver, controller.g3Page);
    app.get('/G2', checkSession, authMiddlewareDriver, controller.g2Page);
    app.post('/submit/detail', checkSession, authMiddlewareDriver, controller.submitDetail);

    //Admin 
    app.get('/appointment', checkSession, authMiddleware, appointmentController.appointmentPage);
    app.post('/get/availableHrSlot', checkSession, authMiddleware, appointmentController.getAvailableHourSlots);
    app.post('/get/availableSecSlot', checkSession, authMiddleware, appointmentController.getAvailableSecondSlots);

    app.post('/get/availableSlots', appointmentController.getAvailableSlots);
    app.post('/submit/appointment', checkSession, authMiddleware, appointmentController.submitAppointmentSlot);
    app.get('/driver/result', checkSession, authMiddleware, appointmentController.driverResultList);


    //Examiner
    app.get('/examiner/view', checkSession, authMiddlewareExaminer, examinerController.examinerPage);
    app.get('/examiner/view/driver/Detail/:id', checkSession, authMiddlewareExaminer, examinerController.viewDriverDetail);
    app.post('/examiner/submit/result', checkSession, authMiddlewareExaminer, examinerController.submitTestResult);


    app.get("/logout", controller.signout);
};