package org.aiupscaling;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.awt.image.*;
import javax.imageio.ImageIO;
import java.awt.Graphics;

public class UHDGenerator {
	private static final String DestinationPath = "./uhd_final/";
	private static final String uhdPath = "./uhd/";
	private static final String uhdTransparentPath = "./uhd/transparent/";
	private static final String hdVolumeOnlyPath = "./hdVolumeOnly/";
	private static final String hdPath = "./hd/";

	private static void copy(File from, File to) throws IOException {
		Files.copy(from.toPath(),
                        to.toPath(),
                        StandardCopyOption.REPLACE_EXISTING);
	}

	private static BufferedImage upscale(File from) throws IOException {
		Upscaler upscaler = new NeighbourBlendUpscaler();
		BufferedImage image = ImageTypeSanitizer.convertType(ImageIO.read(from));
		if (image.getHeight() > 1080) {
			throw new IllegalArgumentException("upscale called on image with width " + image.getWidth() + ", height " + image.getHeight());
		}
		BufferedImage upscaled = upscaler.upscale(image);
		return upscaled;
	}

	private static void merge(BufferedImage background, BufferedImage foreground) {
		Graphics g = background.getGraphics();
		g.drawImage(foreground, 0, 0, null);
	}

	public static void main(String a[]) throws IOException {
		for (int i = 1; i < 8705; i++) {
			String filename = String.format("cloud_frame_%08d.png", i);
			File uhdf = new File(uhdPath + filename);
			File uhdTransparent = new File(uhdTransparentPath + filename);
			File hdF = new File(hdPath + filename);
			File destinationF = new File(DestinationPath + filename);
			boolean processed = false;
			if (uhdf.exists())
			{
				copy(uhdf, destinationF);
				processed = true;
			}
			else if (uhdTransparent.exists()) {
				// process the transparent image.
				File hdOnly = new File(hdVolumeOnlyPath + filename);
				if (hdOnly.exists()) {
					// FIXME: upscale to UHD.
					BufferedImage upscaled = upscale(hdOnly);
					// combine with uhdTransparent.
					merge(upscaled, ImageIO.read(uhdTransparent));
					ImageIO.write(upscaled, "PNG", destinationF);
					processed = true;
				}
				else
					System.out.println("Weird.  UHD Transparent image available but HD volume only is not for " + i);
			}
			else if (hdF.exists()) {
				BufferedImage upscaled = upscale(hdF);
				ImageIO.write(upscaled, "PNG", destinationF);
				processed = true;
			}

			if (!processed) {
				System.out.println("Unable to process file: " + filename);
			}
		}
	}
}