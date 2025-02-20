import { SESClient } from "@aws-sdk/client-ses";

export const email = new SESClient({
    region: process.env.AWS_MAIL_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

export default email;
