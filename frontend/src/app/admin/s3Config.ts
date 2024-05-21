export const s3Config = {
    bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME!,
    region: 'us-east-1',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY!,
    s3Url: 'https://s3.amazonaws.com/lucas-tembras-portfolio-photos/'
}