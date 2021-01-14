package org.aiupscaling;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.*;
import java.awt.image.DataBufferByte;

public class Main {
	private static BufferedImage scaleDown(BufferedImage image) {
		System.out.println("image.getType() is " + image.getType() + ", hoping it is: " + BufferedImage.TYPE_3BYTE_BGR);
		BufferedImage result = new BufferedImage(image.getWidth() / 2, image.getHeight() / 2, BufferedImage.TYPE_3BYTE_BGR);
		byte[] sourcePixels = ((DataBufferByte)image.getRaster().getDataBuffer()).getData();
		byte[] resultPixels = ((DataBufferByte)result.getRaster().getDataBuffer()).getData();
		for (int x = 0; x < result.getWidth(); x++) {
			for (int y = 0; y < result.getHeight(); y++) {
				int sourceIndex = (x * 2 + y * 2 * image.getWidth()) * 3;
				int resultIndex = (x + y * result.getWidth()) * 3;
				resultPixels[resultIndex] = sourcePixels[sourceIndex];
				resultPixels[resultIndex + 1] = sourcePixels[sourceIndex + 1];
				resultPixels[resultIndex + 2] = sourcePixels[sourceIndex + 2];
			}
		}
		
		return result;
	}
	
	public static void main(String a[]) throws Exception {
		BufferedImage image = ImageTypeSanitizer.convertType(ImageIO.read(new File("cloud_frame_00000877.png")));
		BufferedImage smallImage = scaleDown(image);
		ImageIO.write(smallImage, "png", new File("smallImage.png"));
		BufferedImage downscaled = DownscaleUpscale.downscale(smallImage);
		ImageIO.write(downscaled, "png", new File("downscaled.png"));

		Upscaler[] upscalers = new Upscaler[3];
		upscalers[0] = new NeighbourCopyUpscaler();
		upscalers[1] = new NeighbourBlendUpscaler();
		upscalers[2] = new EdgeDetectingUpscaler();
		
		for (Upscaler upscaler: upscalers) {
			String className = upscaler.getClass().getName();
			BufferedImage scaledUp = upscaler.upscale(smallImage);
			ImageIO.write(scaledUp, "png", new File("scaledUpImage_" + className + ".png"));
			System.out.println(className + " difference is: " + ImageComparison.getSumOfPixelValueDifferences(scaledUp, image));
		}
		
		BufferedImage vector = EdgeDetectingUpscaler.drawEdgeVectorImage(downscaled);
		ImageIO.write(vector, "png", new File("vector.png"));
		
		System.out.println("0 expected. difference is: " + ImageComparison.getSumOfPixelValueDifferences(image, image));
	}
}