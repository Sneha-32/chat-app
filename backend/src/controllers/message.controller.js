import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;   //get the logged in user's id or simply my id
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password"); //find all users except the logged in user also deselect the password
        res.status(200).json({filteredUsers})
    } catch (error) {
        console.log("Error in getUserforsidebar:",error.message);
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

    export const getMessages = async(req,res)=>{
        try {
            const {id:userToChatId} = req.params;  //id:userToChatId is like renaming
            const myId = req.user._id;
            const messages = await Message.find({
                $or:[
                    {senderId:myId,receiverId:userToChatId},   //either i am the sender
                    {senderId:userToChatId,receiver:myId}       //or i am the receiver
                ]
            })
            res.status(200).json({messages});
        } catch (error) {
            console.log("Error in getUserforsidebar:",error.message);
        res.status(500).json({error:"Internal Server Error"}); 
        }
    }


    export const sendMessage=async (req,res)=>{
        try {
            const {text,image}=req.body;
            const {id:receiverId}=req.params;
            const senderId = req.user._id;

            let imageUrl;   //checking if image is sent or not
            if(image){
                //upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image);  //uploads the image to cloudinary
                //cloudinary returns an object containing information about the uploaded image 

                //saves the image URL
                imageUrl=uploadResponse.secure_url;
            }

            //creating a new message document on the basis of my message mongodb model
            //new is used for creating an object
            const newMessage = new Message ({
                senderId,  //these are object shorthand which could be written as senderId:senderId
                receiverId,
                text,
                image:imageUrl,
            });

            //saves it to database
            await newMessage.save();

            //todo: realtime functionality goes here =>socket.io

            res.status(201).josn(newMessage);
        } catch (error) {
            console.log("Error in sendmessage controller:",error.message);
        res.status(500).json({error:"Internal Server Error"}); 
        }
    }