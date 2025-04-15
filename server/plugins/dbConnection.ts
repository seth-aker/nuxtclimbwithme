import mongoose from "mongoose"

declare module 'h3' {
  interface H3EventContext {
      mongoose: mongoose.Connection
  }
}

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();
    const mongodbUri = config.mongodbUri;
    if (!mongodbUri) {
        console.warn('[Mongoose] MongoDB URI not provided. Skipping Mongoose connection.');
        return;
      }

    try {
        console.log('[Mongoose] Connecting to MongoDB...');
        await mongoose.connect(mongodbUri, {dbName: config.dbName});
        console.log('[Mongoose] Connected to MongoDB.');
        nitroApp.hooks.hook('request', (event) => {
            event.context.mongoose = mongoose.connection;
        });

        nitroApp.hooks.hook('close', async () => {
            if (mongoose.connection.readyState === 1) {
              console.log('[Mongoose] Disconnecting from MongoDB...');
              await mongoose.disconnect();
              console.log('[Mongoose] Disconnected from MongoDB.');
            }
          });
    } catch (error) {
        console.error('[Mongoose] Error connecting to MongoDB:', error);
    }
})


