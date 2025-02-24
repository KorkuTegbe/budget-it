export const config = {
    jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
    mongodb: {
        uri: <string>process.env.MONGODB_URI,
        collections: {
            users: 'users',
            savings: 'savings',
            budgets: 'budgets',
            spendings: 'spendings',
            transactions: "transactions"
        }
    },
    google: {
        clientID: <string>process.env.GOOGLE_CLIENT_ID
    },
    redis: {
        uri: <string>process.env.REDIS_CLIENT
    },
    cloudinary: {
        cloudinary_cloud_name: <string>process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: <string>process.env.CLOUDINARY_API_KEY,
        cloudinary_secret: <string>process.env.CLOUDINARY_SECRET
    }
}