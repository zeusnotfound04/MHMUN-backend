import { createCanvas, registerFont } from 'canvas';
import QRCode from 'qrcode';
import { UTApi } from 'uploadthing/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

try {
  const poppinsPath = path.resolve('./fonts/Poppins-Bold.ttf');
  if (fs.existsSync(poppinsPath)) {
    registerFont(poppinsPath, { family: 'Poppins' });
    console.log('Poppins font loaded successfully');
  } else {
    console.warn('Poppins-Bold.ttf not found. Will use system fonts instead.');
  }
} catch (error) {
  console.warn('Could not load custom fonts:', error);
}

export async function generateQRCodeWithFormId(formId: string): Promise<string> {
  const qrCode = uuidv4();
  const qrData = `${process.env.BASE_URL}/participant/${qrCode}`;

  const canvasWidth = 500;
  const canvasHeight = 650;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');


  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const qrCanvas = createCanvas(460, 460);
  await QRCode.toCanvas(qrCanvas, qrData, {
    margin: 0,
    width: 460,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const qrX = (canvasWidth - qrCanvas.width) / 2;
  ctx.drawImage(qrCanvas, qrX, 40);

  ctx.fillStyle = '#000000';
  try {
    ctx.font = 'bold 45px Poppins, Arial, sans-serif';
  } catch (error) {
    ctx.font = 'bold 45px Arial, sans-serif';
  }
  ctx.textAlign = 'center';
  ctx.fillText(formId, canvasWidth / 2, 580); 

  const imageBuffer = canvas.toBuffer('image/png');
  const file = new File([imageBuffer], `qr-${qrCode}.png`, {
    type: 'image/png',
  });

  const utapi = new UTApi();
  const uploadResponse = await utapi.uploadFiles([file]);

  if (!uploadResponse || uploadResponse.length === 0) {
    throw new Error('Failed to upload QR code image');
  }

  const firstUpload = uploadResponse[0];

  if (!firstUpload || !firstUpload.data || !firstUpload.data.ufsUrl) {
    throw new Error('Failed to get upload URL from response');
  }

  return firstUpload.data.ufsUrl;
}
