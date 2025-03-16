import catchErrors from "../utils/catchErrors";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/http";

export const getUserHandler = catchErrors(async(req,res)=> {
    const user = await UserModel.findById(req.userId);
    appAssert(user,NOT_FOUND,'User Not found');

    return res.status(200).json(user.omitPassword());
})

export const getAllUsersHandler = catchErrors(async(req,res)=> {
    const users = await UserModel.find({
        _id: {$ne: req.userId}
    }).select('username email');
    appAssert(users,NOT_FOUND,'User Not found');

    return res.status(200).json(users);
})

export const searchUsernameOrEmail = catchErrors(async(req,res)=>{
    const {search} = req.body;

    const data = await UserModel.find({
        $or: [
            {
                $and: [
                    {username: { $regex: search, $options: "i" }},
                    { _id: {$ne: req.userId}}
                ]
            },
            {
                $and: [
                    {email: { $regex: search, $options: "i" }},
                    { _id: {$ne: req.userId}}
                ]
            }
        ]
    });

    appAssert(data,OK,'No Users found');

    return res.status(200).json(data);

})