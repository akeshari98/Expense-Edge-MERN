const User = require("../../model/User")
const bcrypt = require("bcryptjs");
const { AppErr, appErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");




//register
const registerUserCtrl = async(req,res,next)=>{
    const {fullname, password, email} = req.body;
    try {
        //check if email exists
        const userFound = await User.findOne({email})
        if(userFound){
           return next(appErr("User Already Exists",400)) ;
        }

        // //check if fields are empty
        // if(!email || !password || !fullname){
        //     return res.json({message: "Please Provide all fields"})
        // } // Not good way to through errors

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create user
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });
        res.json({
            status:'success',
            fullname: user.fullname,
            email:user.email,
            id: user._id,
        })
    } catch (error) {
        next(new AppErr(error.message, 500));
    }
}

//login
const userLoginCtrl = async(req,res,next)=>{
    const {email, password} = req.body;
    try {
        //check if email exists
        const userFound = await User.findOne({email})
        if(!userFound) { return next(new AppErr("Invalid Login Credentials",400))}
        //check for password validity
        const isPasswordMatch = await bcrypt.compare(password, userFound.password);
        if(!isPasswordMatch) { return next(new AppErr("Invalid Login Credentials",400))}
        res.json({
            status: "success",
            fullname: userFound.fullname,
            id:userFound._id,
            token:generateToken(userFound._id),
        })
    } catch (error) {
        next(new AppErr(error.message, 500));
    }
}

//profile
const userProfileCtrl =  async(req,res)=>{
    //how to get the token from headers
    // console.log(req.headers);
    // const headerObj = req.headers;
    // const token = headerObj["authorization"].split(" ")[1]; //shifted to isLogin
    
    // const result = verifyToken(token);
    // console.log(result);
    
    // const result = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDFiNjE0YmQ5OTY5MTBkZmI1YjgzOSIsImlhdCI6MTcxMjA1MDIzOSwiZXhwIjoxNzEyOTE0MjM5fQ.od0uJ5Medxm-koh0kI8DpBFWRnOfXYbypPLS8f7F3gI");// for matching the user token
    // console.log(result);

    // console.log(req.user);


    try {
        const user = await User.findById(req.user).populate({
            path:"accounts",
            populate:{
                path: "transactions",
                model: "Transaction",
            }
        });
        res.json(user)
    } catch (error) {
        next(new AppErr(error.message, 500));
    }
}

//delete
const deleteUserCtrl =  async(req,res,next)=>{
    try {
        await User.findByIdAndDelete(req.user);
        res.status(200).json({
            status:"success",
            data:null,
        })
        res.json({msg:'Delete route'})
    } catch (error) {
        next(new AppErr(error.message, 500));
    }
}

//update
const updateUserCtrl = async(req,res,next)=>{
    try {
        //Check if email exists
        if(req.body.email){
            const userFound = await User.findOne({email:req.body.email});
        if(userFound){return next(new AppErr("Email already exists or Email is taken", 400))}
        }

        //check is user is updating the password
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            //update the user
            const user = await User.findByIdAndUpdate(req.user,{
                password:hashedPassword,
            },{
                new: true,
                runValidators:true,
            });
            //send the response
            return res.status(200).json({
                status:"success",
                data:user,
            })
        }
        
        const user = await User.findByIdAndUpdate(req.user,req.body,{
            new:true,
            runValidators:true,
        })
        //send the response
        return res.status(200).json({
            status:"success",
            data:user,
        })
    } catch (error) {
        next(new AppErr(error.message, 500));
    }
}

module.exports={
    registerUserCtrl,
    userLoginCtrl,
    userProfileCtrl,
    deleteUserCtrl,
    updateUserCtrl,
}