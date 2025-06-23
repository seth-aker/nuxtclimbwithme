import  User from '~/server/models/User'
import authorizeUser from '~/server/utils/authorizeUser';
import readBodyProtection from "~/server/utils/readBodyProtection";

export default defineEventHandler(async (event) => {
    await authorizeUser(event)
    readBodyProtection(event);
    const body = await readValidatedBody(event, validateUser(false));
    await User.create(body)
    setResponseStatus(event, 201, "User Created Successfully");
});
