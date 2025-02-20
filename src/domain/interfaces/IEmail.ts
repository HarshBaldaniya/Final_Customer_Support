import { IMailRequest, IMailResponse } from "../models/mail";

export interface IMailRepository {
    sendMail(mail: IMailRequest): Promise<IMailResponse>;
}
