/* eslint-disable @typescript-eslint/no-unused-vars */
import { createCanvas, registerFont } from 'canvas';
import QRCode from 'qrcode';
import { UTApi } from 'uploadthing/server';

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
  console.error('Error loading Poppins font:', error);
}

export async function generateQRCodeWithFormId(formId: string, participantId: string): Promise<string> {
  const qrData = `${process.env.BASE_URL}/participants/${participantId}`;

  // Make canvas more square for better proportions (600x600)
  const canvasWidth = 600;
  const canvasHeight = 700;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Create QR code with better margins
  const qrSize = 500; // Slightly larger QR code
  const qrCanvas = createCanvas(qrSize, qrSize);
  await QRCode.toCanvas(qrCanvas, qrData, {
    margin: 1, // Small margin to prevent edge clipping
    width: qrSize,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H', // High error correction for better scanning
  });
  // Center QR code perfectly on canvas
  const qrX = (canvasWidth - qrCanvas.width) / 2;
  const qrY = 50; // Position from top
  ctx.drawImage(qrCanvas, qrX, qrY);

  // Draw a subtle border around QR code for better definition
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(qrX - 2, qrY - 2, qrCanvas.width + 4, qrCanvas.width + 4);

  // Text styling
  ctx.fillStyle = '#000000';
  try {
    ctx.font = 'bold 40px Poppins, Arial, sans-serif';
  } catch (error) {
    ctx.font = 'bold 40px Arial, sans-serif';
  }
  ctx.textAlign = 'center';
  ctx.fillText(formId, canvasWidth / 2, 610);
  
  const imageBuffer = canvas.toBuffer('image/png')

  const file = new File([new Uint8Array(imageBuffer)], `qr-${participantId}.png`, {
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
