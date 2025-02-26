import { Controller, Get, Param, Res, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService, private readonly prisma: PrismaService) { }

    @Get('event/:id')
    async generateEventPdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const event = await this.prisma.tb_event.findUnique({
            where: { id: id },
            include: {
                party_house: true, // Traz a casa de festas
                artists: {
                    include: { artist: true }, // Inclui os artistas do evento
                },
            },
        });

        // Ajustando estrutura dos artistas
        const eventData = {
            id: event.id,
            name: event.name,
            party_house: event.party_house,
            artists: event.artists.map(a => ({ id: a.artist.id, name: a.artist.name })),
        };
        const pdfBuffer = await this.pdfService.generatePdf(eventData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="event.pdf"');
        res.send(pdfBuffer);
    }
}
