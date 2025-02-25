import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {

  private async createBrowserPage() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    return { browser, page };
  }
  async generateEventPdf(event: any): Promise<Buffer> {
    const { browser, page } = await this.createBrowserPage();

    // Criando HTML dinâmico com os dados do evento
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .event { border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
          .artists { margin-left: 20px; }
          .artists li { list-style-type: square; }
        </style>
      </head>
      <body>
        <h1>${event.name}</h1>
        <p><strong>Endereço:</strong> ${event.party_house.address}</p>
        <h2>Artistas Confirmados:</h2>
        <ul class="artists">
          ${event.artists.map(artist => `<li>${artist.name}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4', margin: { top: '30px', bottom: '30px' } }));
    await browser.close();
    return pdfBuffer;
  }
}
