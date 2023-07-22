const userModel = require("../models/userModel");
const bcrypt = require("bcrypt")

//create user register
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = await req.body
        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                massage: "Please fill all fields"
            })
        }
        //exisiting user
        const exisitingUser = await userModel.findOne({ email });
        if (exisitingUser) {
            return res.status(401).send({
                success: false,
                massage: "user already exisits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        //save new user
        const user = new userModel({ username, email, password: hashedPassword })
        await user.save()
        return res.status(201).send({
            success: true,
            massage: "Register successfull",
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            massage: "Error in Register callback",
            success: false,
            error
        })
    }
};

//get all user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).send({
            userCount: users.length,
            success: true,
            massage: "all users data",
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            massage: "Error in get all data",
            error
        })
    }
};

//create user login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = await req.body
        //validation
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                massage: "Please fill all fields"
            })
        }
        const user = await userModel.findOne({ email })
        if (!email) {
            return res.status(200).send({
                success: false,
                massage: "Email is not register"
            })
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                massage: "Invalid username or password"
            })
        }
        return res.status(200).send({
            success: true,
            massage: "Login successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            massage: "Error in login callback",
            error
        })
    }
}