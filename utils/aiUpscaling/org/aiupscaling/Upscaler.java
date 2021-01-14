package org.aiupscaling;

import java.awt.image.BufferedImage;

public interface Upscaler {
	public BufferedImage upscale(BufferedImage smallImage);
}