const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel")

//get all blogs
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({})
        if (!blogs) {
            return res.status(200).send({
                success: false,
                massage: "No Blogs Found"
            })
        }
        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            massage: "All Blogs lists",
            blogs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            massage: "Error While Getting Blogs",
            error
        })
    }
}

//create blog
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = await req.body
        //validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                massage: "Please provide all fields"
            })
        }
        const exisitingUser = await userModel.findById(user)
        if (!exisitingUser) {
            return res.status(400).send({
                success: false,
                massage: "unable to find user"
            })
        }
        const newBlog = new blogModel({ title, description, image, user });
        const session = await mongoose.startSession()
        session.startTransaction();
        await newBlog.save({ session });
        exisitingUser.blogs.push(newBlog);
        await exisitingUser.save({ session })
        await session.commitTransaction();
        await newBlog.save();
        return res.status(200).send({
            success: true,
            massage: "Blog Created!",
            newBlog
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            massage: "Error while creating blogs",
            error
        })
    }
}

//update blog
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        return res.status(200).send({
            success: true,
            massage: "Blog Updated",
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            massage: "Error While updating Blog",
            error
        })
    }
}

//delete blog
exports.deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findByIdAndDelete(id).populate("user");
        await blog.user.pull(blog)
        await blog.user.save();
        return res.status(200).send({
            success: true,
            massage: "Blog Deleted"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            massage: "Error While Deleteing Blog",
            error
        })
    }
}
//get single blog
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(400).send({
                success: false,
                massage: "Blog not found with this id",

            });
        };
        return res.status(200).send({
            success: true,
            massage: "fetch single blog",
            blog
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            massage: "Error While getting data",
            error
        })
    }
}