import  User from '~/server/models/User'
import readBodyProtection from "~/server/utils/readBodyProtection";

export default defineEventHandler(async (event) => {
    // Authorize()
    readBodyProtection(event);
    const body = await readValidatedBody(event, validateUser);
    await User.create(body)
    setResponseStatus(event, 201, "User Created Successfully");
});
