import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import * as path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class PdfService {
  private fonts = {
    Roboto: {
      normal: path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'pdf',
        'fonts',
        'Roboto-Regular.ttf',
      ),
      bold: path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'pdf',
        'fonts',
        'Roboto-Medium.ttf',
      ),
      italics: path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'pdf',
        'fonts',
        'Roboto-Italic.ttf',
      ),
      bolditalics: path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'pdf',
        'fonts',
        'Roboto-MediumItalic.ttf',
      ),
    },
  };

  private printer = new PdfPrinter(this.fonts);

  async generateReservationPdf(
    reservation: any,
    booking: any,
  ): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Hotel Amin International',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 2,
              color: '#007ACC',
            } as any,
          ],
          margin: [0, 0, 0, 10],
        },
        { text: 'Reservation Summary', style: 'header' },
        {
          style: 'detailsTable',
          table: {
            widths: ['*', '*'],
            body: [
              ['Reservation ID:', reservation.reservation_id],
              ['User Phone:', reservation.phone],
              ['Check-in Date:', reservation.checkin_date],
              ['Check-out Date:', reservation.checkout_date],
              ['Room Price:', reservation.room_price],
              ['Discount Price:', reservation.discount_price],
              ['Coupon Code:', reservation.coupon_code],
              ['Total Price:', reservation.total_price],
            ],
          },
          layout: 'noBorders',
        },
        {
          text: 'Booking Info',
          style: 'subheader',
          margin: [0, 15, 0, 5],
        },
        {
          style: 'detailsTable',
          table: {
            widths: ['*', '*'],
            body: [
              ['Room Number:', reservation.no_of_rooms],
              ['Booking Type:', reservation.typeOfBooking],
            ],
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        title: {
          fontSize: 24,
          bold: true,
          color: '#007ACC',
        },
        header: {
          fontSize: 20,
          bold: true,
          color: '#444444',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#00796B',
          margin: [0, 10, 0, 5],
        },
        detailsTable: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
      },
    };

    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    const chunks: any[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    });
  }
}
