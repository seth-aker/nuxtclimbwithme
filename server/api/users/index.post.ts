import mongoose from 'mongoose';
import  User, { IUser } from '~/server/models/User'
import readBodyProtection from "~/server/utils/readBodyProtection";

export default defineEventHandler(async (event) => {
    // Authorize()
    readBodyProtection(event);
    const body: IUser = await readBody(event);
    await User.create(body)
    setResponseStatus(event, 201, "User Created Successfully");
});