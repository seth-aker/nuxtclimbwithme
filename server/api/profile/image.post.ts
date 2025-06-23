import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event)
    const config = useRuntimeConfig();
    const aws = event.context.aws;
    try {
        const file = await readFormData(event)
        const image = file.get('profile:image');
        if(!file || !image || typeof image === 'string') {
            throw createError({
                statusCode: 400,
                message: "Bad Request"
            })
        }
        const uri = `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/profile/${(session.userInfo?.sub as string).split("|")[1]}.${image.type.split('/')[1]}`;
        const response = await aws.fetch(uri, {
            method: 'PUT',
            body: image
        })
        console.log(response)
        if(response.status !== 200) {
            createError('An error occurred uploading file');
        }
        const user = await fetchUser(session.userInfo?.sub as string)
        user.profilePicture = `${response.url}?cache=${Date.now()}`;
        user.save();
        return {status: 200}        
    } catch (e) {
        console.log(e)
        throw e
    }
})
