import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword (val: string): Promise<boolean>;
    omitPassword(): Pick<UserDocument, '_id' | 'email' | 'username' | 'verified' | 'createdAt' | 'updatedAt' >;
};

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true},
    password: { type: String, required: true},
    verified: { type: Boolean, default: false, required: true },
},{
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    this.password = await hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = async function (val: string) {
    return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;