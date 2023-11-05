const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const UserData = require("./modules/UserData");
app.use(express.json());
app.use(express.urlencoded());


// to connect with mongoose connection 
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.f8rjolj.mongodb.net/DriveTest1?retryWrites=true&w=majority"
);

 
app.use(express.static("public"));
app.set("view engine", "ejs");

// website will listen on 4040 port number
app.listen(4040, () => {
  console.log("hello, project is working");
});

//  routes with render files respectively
app.get("/", (req, res) => {
  res.render("dashboard");
});
app.get("/g_page", (req, res) => {
  // here we send umdefine data to g paga, because we will send data once we receive from database
  res.render("g_page",{data:undefined});
});
app.get("/g2_page", (req, res) => {
  res.render("g2_page");
});
app.get("/login", (req, res) => {
  res.render("login_page");
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
app.post("/g2_page/receive_data/update_data", (req, res) => {

  const update = {
    description: req.body.description,
    model_type: req.body.model_type,
    plat_number: req.body.plat_number,
    year: req.body.year,
  };

// using findOneAndUpdate function we can update values on database
  UserData.findOneAndUpdate(  
    { license_no: req.body.license_no },
    update,
    (error, UserData) => {
      res.render("g_page",{data:null});
    }
  );
});

app.post("/g2_page/store", async (req, res) => {
  res.redirect("/");
  console.log(req.body);
  // once data is received from g2 page, 
  // this block will update data to database
  await UserData.create(req.body);
});

app.post("/g_page/receive_data", async(req, res) => {
//   to find users data from database using license number
  let license_ = req.body.license_no;
  UserData.find({ license_no: license_ },async (error, UserData) => {
    console.log(error, UserData);

    //  it will store userdata to data variable
 let data =  await UserData;

    if (data.length > 0) {
      // if data contain any value then this block will run
      res.render("g_page",{ data }) 
    } else {
      // this block will render error page 
      res.render("error");
    }
  });
});
