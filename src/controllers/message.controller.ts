import { NOT_FOUND } from "../constants/http";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { messageSchema } from "./message.schema";

export const addNewMessage = catchErrors(async(req,res)=>{
    // validate the request
    const request = messageSchema.parse({
        ...req.body,
        senderId: req.userId
    });

    // add new message
    const message = await MessageModel.create(request);

    return res.status(200).json(message);
    
})

export const getMessages = catchErrors(async(req,res)=> {
    const senderId = req.userId;
    const username = req.params.id;

    // get userId from username
    const recipientId = await UserModel.findOne({username: username});
    appAssert(recipientId, NOT_FOUND, 'User Not Found');

    //get messages thread
    const messages = await MessageModel.find({
        $and: [
            { $or: [{recipientId}, {recipientId: senderId}] },
            { $or: [{senderId}, {senderId: recipientId}] }
        ]
    }).sort({timestamp: 1})
    ;

    return res.status(200).json(messages);
})