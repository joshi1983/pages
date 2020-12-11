package org.blender;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class ImageBlender {
	private static double[] getBlendRatios(int numFrames) {
		if (numFrames == 0)
			return new double[0];
		if (numFrames == 1)
			return new double[] {1};
		double [] result = new double[numFrames];
		double halfNumFrames = (numFrames - 1) * 0.5;
		
		double sum = 0;
		for (int i = 0; i < numFrames; i++) {
			double dx = Math.abs(i - halfNumFrames) / (0.25 + halfNumFrames);
			double val = Math.sqrt(1 - dx * dx);
			sum += val;
			result[i] = val;
		}
		// now, scale the values to make the sum exactly 1.
		double scale = 1.0 / sum;
		for (int i = 0; i < numFrames; i++) {
			result[i] *= scale;
		}
		return result;
	}

	/**
	Returns an image from blending all the specified images together.
	
	@param images must be of type BufferedImage.TYPE_3BYTE_BGR and have the same width and height.
	*/
	public static BufferedImage blendImages(BufferedImage [] images) {
		double []blendRatios = getBlendRatios(images.length);
		BufferedImage image1 = images[0];
		BufferedImage result = new BufferedImage(image1.getWidth(), image1.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
		byte[][] pixels = new byte[images.length][];
		byte[] resultPixels = ((DataBufferByte) result.getRaster().getDataBuffer()).getData();
		for (int i = 0; i < images.length; i++) {
			pixels[i] = ((DataBufferByte) images[i].getRaster().getDataBuffer()).getData();
		}

		for (int y = 0; y < result.getHeight(); y++) {
			for (int x = 0; x < result.getWidth(); x++) {
				double r = 0, g = 0, b = 0;
				int index = (x + y * result.getWidth()) * 3;
				for (int i = 0; i < images.length; i++) {
					r += Byte.toUnsignedInt(pixels[i][index]) * blendRatios[i];
					g += Byte.toUnsignedInt(pixels[i][index + 1]) * blendRatios[i];
					b += Byte.toUnsignedInt(pixels[i][index + 2]) * blendRatios[i];
				}
				resultPixels[index] = (byte)r;
				resultPixels[index + 1] = (byte)g;
				resultPixels[index + 2] = (byte)b;
			}
		}
		
		return result;
	}
}