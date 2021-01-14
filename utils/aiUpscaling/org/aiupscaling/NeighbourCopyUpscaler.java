package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class NeighbourCopyUpscaler implements Upscaler {

	public BufferedImage upscale(BufferedImage smallImage) {
		BufferedImage result = new BufferedImage(smallImage.getWidth() * 2, smallImage.getHeight() * 2, BufferedImage.TYPE_3BYTE_BGR);
		// get the pixel data.
		byte[] smallPixels = ((DataBufferByte) smallImage.getRaster().getDataBuffer()).getData();
		byte[] resultPixels = ((DataBufferByte) result.getRaster().getDataBuffer()).getData();

		for (int x = 0; x < smallImage.getWidth(); x++) {
			for (int y = 0; y < smallImage.getHeight(); y++) {
				int smallImageIndex = (x + y * smallImage.getWidth()) * 3;
				int resultIndex = (x + y * result.getWidth()) * 2 * 3;
				byte r = smallPixels[smallImageIndex];
				byte g = smallPixels[smallImageIndex + 1];
				byte b = smallPixels[smallImageIndex + 2];
				for (int i = 0; i < 2; i++) {
					for (int j = 0; j < 2; j++) {
						int resultIndex2 = resultIndex + (i + j * result.getWidth()) * 3;
						resultPixels[resultIndex2] = r;
						resultPixels[resultIndex2 + 1] = g;
						resultPixels[resultIndex2 + 2] = b;
					}
				}
			}
		}
		
		return result;
	}
	
}