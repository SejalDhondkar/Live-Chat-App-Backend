import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
    senderId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    message: String;
    iv: String;
    timestamp: Date;
    isRead: Boolean;
}

const messageSchema = new mongoose.Schema<MessageDocument> ({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    message: { type: String},
    iv: { type: String},
    timestamp: {type:Date, required: true, default: Date.now},
    isRead: { type:Boolean, default: false}
});

const MessageModel = mongoose.model<MessageDocument>('Message', messageSchema);

export default MessageModel;