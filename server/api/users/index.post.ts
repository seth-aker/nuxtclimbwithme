import  User from '~/server/models/User'
import findUserBySub from "~/server/utils/findUserBySub"
import readBodyProtection from "~/server/utils/readBodyProtection";

export default defineEventHandler(async (event) => {
    await findUserBySub(event);
    readBodyProtection(event);
    const body = await readValidatedBody(event, validateUser(false));
    await User.create(body)
    setResponseStatus(event, 201, "User Created Successfully");
});
