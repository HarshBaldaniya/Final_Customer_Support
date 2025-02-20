import { IMailRepository } from "../../domain/interfaces/IEmail";
import { IMailRequest, IMailResponse } from "../../domain/models/mail";
import { MailRepository } from "../../infrastructure/repositories/mailRepository";

export class MailService {
    private repository: IMailRepository;

    constructor(repository: IMailRepository) {
        this.repository = repository;
    }

    async sendEmail(mail: IMailRequest): Promise<IMailResponse> {
        return await this.repository.sendMail(mail);
    }
}

export default new MailService(new MailRepository());
