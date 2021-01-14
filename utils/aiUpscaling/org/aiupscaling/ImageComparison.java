package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class ImageComparison {
	public static double getSumOfPixelValueDifferences(BufferedImage image1, BufferedImage image2) {
		if (image1.getWidth() != image2.getWidth() || image1.getHeight() != image2.getHeight())
			throw new IllegalArgumentException("Can not compare images unless both are of same dimensions");

		double result = 0;
		// loop through all pixels.
		byte[] pixels1 = ((DataBufferByte) image1.getRaster().getDataBuffer()).getData();
		byte[] pixels2 = ((DataBufferByte) image2.getRaster().getDataBuffer()).getData();
		
		for (int i = 0; i < pixels1.length; i++) {
			result += Math.abs(Byte.toUnsignedInt(pixels1[i]) - Byte.toUnsignedInt(pixels2[i]));
		}
		
		return result;
	}
}