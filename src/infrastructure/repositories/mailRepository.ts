import { IMailRequest, IMailResponse } from './../../domain/models/mail';
import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { IMailRepository } from "../../domain/interfaces/IEmail";
import email from "../../app/config/emailConnection";
import { MailStatus } from "../../utils/types/mail";
import { logger } from "../../config/logger";

export class MailRepository implements IMailRepository {
    private senderEmail: string;

    constructor() {
        this.senderEmail = process.env.AWS_SENDER!;
    }

    async sendMail(mail: IMailRequest): Promise<IMailResponse> {
        try {
            const emailParams: SendEmailCommandInput = {
                Destination: { ToAddresses: mail.to },
                Message: {
                    Body: { Html: { Data: mail.body } },
                    Subject: { Data: mail.subject },
                },
                Source: mail.from || this.senderEmail,
            };

            const command = new SendEmailCommand(emailParams);
            const response = await email.send(command);

            return {
                messageId: response.MessageId || "unknown",
                status: MailStatus.SENT,
            };
        } catch (error) {
            logger.error("Error sending email:", error);
            return {
                messageId: "error",
                status: MailStatus.FAILED,
            };
        }
    }
}

export default new MailRepository();
