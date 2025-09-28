import imageKit from "../configs/ImageKit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from 'axios'




//Texted-based AI chat message controller 
export const textMessageController = async (req, res) => {

    try {
        const userId = req.user._id;

        //check credits 

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "you don't have enough credits to use this feature" })
        }


        const { chatId, prompt } = req.body;
        const chat = await Chat.findOne({ userId, _id: chatId });

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [

                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };

        chat.messages.push(reply)
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
        res.json({ success: true, reply })


    } catch (error) {
        res.json({ success: false, message: error.messages })
    }
}


// Image generation message controller 
export const imageMessageController = async (req, res) => {
    try {

        const userId = req.user._id;
        //check credits

        if (req.user.credits < 2) {
            return res.json({ success: false, message: "you don't have enough credits to generate this image" })
        }

        const { prompt, chatId, isPublished } = req.body;
        //find chat

        const chat = await Chat.findOne({ userId, _id: chatId });

        //push user message 
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        })

        //Encode the prompt

        const encodedPrompt = encodeURIComponent(prompt);

        //construct imageKit AI generation url link

        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt${Date.now()}.png?tr=w-800, h-800`

        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' })

        //convert AI-Generated to base64

        const base64Image = `data:image/png;base64, ${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`

        // upload image to imageKit Media Library 

        const uploadResponse = await imageKit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'quickgpt-Images'
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        res.json({ success: true, reply });

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })




    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
} 