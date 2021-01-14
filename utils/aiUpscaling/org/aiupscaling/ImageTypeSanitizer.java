package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.Graphics;

public class ImageTypeSanitizer {
	public static BufferedImage convertType(BufferedImage image) {
		if (image.getType() == BufferedImage.TYPE_3BYTE_BGR)
			return image;
		else {
			BufferedImage result = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
			Graphics g = result.getGraphics();
			g.drawImage(image, 0, 0, null);
			return result;
		}
	}
}