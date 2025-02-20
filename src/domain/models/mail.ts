import { MailStatus } from "../../utils/types/mail";

export interface IMailRequest {
    to: string[];
    subject: string;
    body: string;
    from?: string;
}

export interface IMailResponse {
    messageId: string;
    status: MailStatus;
}