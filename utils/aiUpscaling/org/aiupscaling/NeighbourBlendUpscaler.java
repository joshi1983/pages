package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class NeighbourBlendUpscaler implements Upscaler {
	public static void blendPixel(byte[] smallPixels, byte[] resultPixels, int smallWidth, int smallHeight, int x, int y) {
		int resultWidth = smallWidth << 1;
		int smallImageIndex = (x + y * smallWidth) * 3;
		int resultIndex = (x + y * resultWidth) * 2 * 3;
		byte r = smallPixels[smallImageIndex];
		byte g = smallPixels[smallImageIndex + 1];
		byte b = smallPixels[smallImageIndex + 2];
		for (int i = 0; i < 2; i++) {
			for (int j = 0; j < 2; j++) {
				int resultIndex2 = resultIndex + (i + j * resultWidth) * 3;
				if ((i == 0 && j == 0) || (x == smallWidth - 1 && y == smallHeight - 1) ||
				(i == 0 && y == smallHeight - 1)) {
					resultPixels[resultIndex2] = r;
					resultPixels[resultIndex2 + 1] = g;
					resultPixels[resultIndex2 + 2] = b;
				}
				else {
					// blend neighbouring source pixels.
					int index2;
					if (i == 0 || x == smallWidth - 1) {
						index2 = (x + (y + 1) * smallWidth) * 3;
					}
					else if (j == 0 || y == smallHeight - 1) {
						index2 = ((x + 1) + y * smallWidth) * 3;
					}
					else {
						index2 = ((x + 1) + (y + 1) * smallWidth) * 3;
					}
					resultPixels[resultIndex2] = (byte)((Byte.toUnsignedInt(r) + Byte.toUnsignedInt(smallPixels[index2])) >> 1);
					resultPixels[resultIndex2 + 1] = (byte)((Byte.toUnsignedInt(g) + Byte.toUnsignedInt(smallPixels[index2 + 1])) >> 1);
					resultPixels[resultIndex2 + 2] = (byte)((Byte.toUnsignedInt(b) + Byte.toUnsignedInt(smallPixels[index2 + 2])) >> 1);
				}
			}
		}
	}
	
	public BufferedImage upscale(BufferedImage smallImage) {
		BufferedImage result = new BufferedImage(smallImage.getWidth() * 2, smallImage.getHeight() * 2, BufferedImage.TYPE_3BYTE_BGR);
		// get the pixel data.
		byte[] smallPixels = ((DataBufferByte) smallImage.getRaster().getDataBuffer()).getData();
		byte[] resultPixels = ((DataBufferByte) result.getRaster().getDataBuffer()).getData();

		for (int x = 0; x < smallImage.getWidth(); x++) {
			for (int y = 0; y < smallImage.getHeight(); y++) {
				blendPixel(smallPixels, resultPixels, smallImage.getWidth(), smallImage.getHeight(), x, y);
			}
		}
		
		return result;
	}
}