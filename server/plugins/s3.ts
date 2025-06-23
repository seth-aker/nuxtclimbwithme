
import { AwsClient } from 'aws4fetch'

declare module 'h3' {
    interface H3EventContext {
        aws: AwsClient
    }
}

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig();
    const aws = new AwsClient({
        accessKeyId: config.s3AccessKeyId,
        secretAccessKey: config.s3SecretAccessKey,
    })
    nitroApp.hooks.hook('request', (event) => {
        event.context.aws = aws;
    })
    console.log('[S3] AWS Client mounted')
})
