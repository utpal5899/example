const mongoose= require("mongoose");
const schema= mongoose.Schema;


const UserDataSchema= new schema({

    f_Name: String,
    l_Name:String,
    license_no:String,
    age:Number, 
    date_of_birth: String,
    description: String,
    model_type: String,
    year: String,
    plat_number:String

})



const UserData= mongoose.model("UserData",UserDataSchema);

module.exports=UserData;