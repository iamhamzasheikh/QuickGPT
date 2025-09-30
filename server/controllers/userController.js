import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";



// generate JWT

const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })

}
 
// api to register users
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: 'user with this email already exist' })
        }


        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);
        res.json({ success: true, token })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// api for login user

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                const token = generateToken(user._id);
                return res.json({ success: true, token })
            }
        }

        return res.json({ success: false, message: 'Invalid Email or password' })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// api to get user data 

export const getUser = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user: req.user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// api to published images

export const getPublishedImages = async (req, res) => {

    try {

        const publishedImagesMessages = await Chat.aggregate([
            { $unwind: '$messages' },

            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true,
                }
            },

            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }

        ])

        res.json({ success: true, images: publishedImagesMessages.reverse() })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}