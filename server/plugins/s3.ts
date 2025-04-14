import s3Driver from 'unstorage/drivers/s3'
export default defineNitroPlugin((nitroApp) => {
    const storage = useStorage()
    const config = useRuntimeConfig();
    const driver = s3Driver({
        accessKeyId: config.s3AccessKeyId,
        secretAccessKey: config.s3SecretAccessKey,
        endpoint: config.s3Endpoint,
        bucket: config.s3Bucket,
        region: config.s3Region
    })
    storage.mount('s3', driver);
})
