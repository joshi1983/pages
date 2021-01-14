package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class DownscaleUpscale {
	public static BufferedImage downscale(BufferedImage image1) {
		BufferedImage result = new BufferedImage(image1.getWidth() / 2, image1.getHeight() / 2, BufferedImage.TYPE_3BYTE_BGR);
		byte[] image1Pixels = ((DataBufferByte) image1.getRaster().getDataBuffer()).getData();
		byte[] resultPixels = ((DataBufferByte) result.getRaster().getDataBuffer()).getData();
		
		for (int x = 0; x < result.getWidth(); x++) {
			for (int y = 0; y < result.getHeight(); y++) {
				int r = 0;
				int g = 0;
				int b = 0;
				for (int i = 0;  i < 2; i++) {
					for (int j = 0; j < 2; j++) {
						int index = (x * 2 + i + (y * 2 + j) * image1.getWidth()) * 3;
						r += Byte.toUnsignedInt(image1Pixels[index]);
						g += Byte.toUnsignedInt(image1Pixels[index + 1]);
						b += Byte.toUnsignedInt(image1Pixels[index + 2]);
					}
				}
				int resultIndex = (x + y * result.getWidth()) * 3;
				resultPixels[resultIndex] = (byte)(r >> 2);
				resultPixels[resultIndex + 1] = (byte)(g >> 2);
				resultPixels[resultIndex + 2] = (byte)(b >> 2);
			}
		}
		
		return result;
	}
}