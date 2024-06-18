const mongoose = require("mongoose")

//connect
const dbConnect = async()=>{
    try {
        await mongoose.connect("mongodb+srv://amankumar220203:MPP188YzFuLbwWCy@expenses-tracker.emth5nk.mongodb.net/income-expenses-app?retryWrites=true&w=majority&appName=expenses-tracker");
        console.log("DB connected successfully");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}


dbConnect();