import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TicketBoughtDto } from './dto/ticket-bought.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA_DE_APP,
      },
    });
  }

  async ticketBoughtEmail(dto: TicketBoughtDto) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: dto.email,
      subject: 'Compra confirmada!',
      text: 'Compra de ingresso confirmada.',
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50;">Olá, ${dto.username}!</h2>
      <p style="font-size: 16px; color: #333333;">
        Sua compra foi <strong>confirmada</strong> com sucesso!
      </p>
      <p style="font-size: 16px; color: #333333;">
        Aqui estão os detalhes do seu ingresso:
      </p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Evento:</strong> ${dto.eventName}</li>
        <li><strong>Ingresso:</strong> ${dto.ticketName}</li>
      </ul>
      <p style="margin-top: 20px; font-size: 14px; color: #777;">
        Guarde este e-mail como confirmação da sua compra.
      </p>
      <p style="margin-top: 40px; font-size: 12px; color: #aaaaaa; text-align: center;">
        © ${new Date().getFullYear()} SyncEventos Inc.
      </p>
    </div>
  </div>
`
    };

    // TODO: FAZER EXCEPTION FILTER PARA CAPTURAR ERRO
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado: ${info.response}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      throw error;
    }

  }
}
