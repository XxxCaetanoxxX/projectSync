import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {

  private async htmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html)
    const uint8Array = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '50px', left: '50px', bottom: '50px', right: '50px' }, });
    await browser.close();
    const buffer = Buffer.from(uint8Array);
    return buffer;
  }

  async headerFooterTemplate(data: { title: string; content: string }) {
    return await `
    <html>
    <head>
      <title>${data.title.toUpperCase()}</title>
    </head>
    <body
      style="display: flex; justify-content: space-between; flex-direction: column; margin: 0; color:gray; font-family: 'Roboto', sans-serif; height: 100vh;">
      <main style="display: flex; flex-direction: column; gap: 2em;">
        <div>
          ${data.content}
        </div>
      </main>
      <footer
        style="font-size: small; font-weight: 500; border-top: rgb(183, 181, 181) 2px solid; padding: 10px; line-height: 2em; text-align: center;">
        Oferecimento de SyncEvents <br>
        Rua Bernardo Guimarães, 2731, 6° andar, Bairro Santo Agostinho, Belo Horizonte/MG, tel (31) 2522-8658
      </footer>
    </body>
    </html>
    `;
  }

  async generatePdf(event: any) {
    const body =
      `
    <h1>${event.name}</h1>
    <ul>
    ${event.artists.map(a=>`<li>${a.name}</li>`).join('')}
    </ul>
    `;

    const html = await this.headerFooterTemplate({ title: event.name, content: body });
    const buffer = await this.htmlToPdf(html);
    return buffer
  }

}
