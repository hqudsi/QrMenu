import { Injectable } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class PrintQrService {

  pdfObj = null;
  cafeData: any;

  constructor(
    private plt: Platform,
    private fileOpener: FileOpener
  ) {

  }

  printDocument(cafeData) {
    this.cafeData = cafeData;
    this.createPdf();
  }

  createPdf() {
    // const barcode = { image: this.textToBase64Barcode(this.data.oid), width: 200 };
    let docDefinition = {
      pageSize: 'A6',
      pageOrientation: 'portrait',
      pageMargins: [20, 30, 20, 10],
      content: [
        { text: 'Scan QR for our', style: 'header' },
        { text: '-----  MENU  -----', style: 'title' },
        { qr: `https://qrcafe.ps/restaurant/${this.cafeData.id}`, fit: '200', style: 'qr' },
        { text: `free Wi-Fi: ${this.cafeData.wifi}`, style: 'footer' },
        { text: 'Scan using your phone\'s camera or any free QR/barcode reader in the apps store:', style: 'note_header' },
        { text: 'Step 1 : Connection to the Internet is required.', style: 'note' },
        { text: 'Step 2 : Open your camera app and aim it at the QR Code.', style: 'note' },
        { text: 'Step 3 : The menu will open using your phone\'s browser.', style: 'note' },
        { text: 'note : "Android" devices may need active "QR" feature from camera setting or need additional app.', style: 'note_footer' }
      ],
      styles: {
        qr: {
          alignment: 'center'
        },
        header: {
          alignment: 'center',
          margin: [ 0, 0, 0, 0 ],
          fontSize: 15,
          bold: true
        },
        title: {
          alignment: 'center',
          margin: [ 0, 5, 0, 15 ],
          fontSize: 15,
          bold: true,
          color: "red"
        },
        footer: {
          margin: [ 0, 15, 0, 15 ],
          alignment: 'center',
          fontSize: 15,
          bold: true
        },
        note_header: {
          alignment: 'justified',
          margin: [ 0, 3, 0, 0 ],
          fontSize: 8
        },
        note: {
          alignment: 'justified',
          margin: [ 5, 5, 0, 0 ],
          fontSize: 8
        },
        note_footer: {
          alignment: 'justified',
          margin: [ 0, 8, 0, 0 ],
          fontSize: 8
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `order_act.pdf`;
          const result = await Filesystem.writeFile({
            path: path,
            data: data,
            directory: Directory.Documents,
            recursive: true
          });
          this.fileOpener.open(result.uri, 'application/pdf')
            .then(() => console.log('done'))
            .catch(e => console.log('Error opening file'));
        } catch (e) {
          console.log('Unable to write file');
        }
      });
    } else {
      this.pdfObj.download();
    }
  }
}
