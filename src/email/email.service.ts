import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  async sendEmail() {
    const nodemailer = require('nodemailer');

    // Configuração do transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA_DE_APP
      },
    });

    // Configuração do email
    const mailOptions = {
      from: process.env.EMAIL, // remetente
      to: 'caetanocesar70@gmail.com', // destinatário
      subject: 'teste', // assunto
      text: 'teste', // corpo do email em texto
      html: '<p style="color: red"><strong>Teste email</strong></p>' // corpo do email em HTML (opcional)
    };

    // TODO: FAZER EXCEPTION FILTER PARA CAPTURAR ERRO
    // Enviando o email
    try {
      const info = await transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado: ${info.response}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      throw error; // Opcional: rejeita a promise para tratamento externo
    }

  }
}
