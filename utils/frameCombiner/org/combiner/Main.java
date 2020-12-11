package org.combiner;

import java.awt.image.*;
import java.awt.*; // Graphics
import javax.imageio.ImageIO;
import java.io.*;

public class Main {
	private static BufferedImage combine(BufferedImage leftImage, BufferedImage rightImage) {
		BufferedImage newImage = new BufferedImage(leftImage.getWidth(), leftImage.getHeight(), BufferedImage.TYPE_3BYTE_BGR);
		Graphics g = newImage.getGraphics();
		
		g.drawImage(leftImage, 0, 0, null);
		int clipWidth = 40;
		// draw only the last 30 pixels or so of the right image.
		int clipLeft = 1920 - clipWidth;
		g.setClip(new Rectangle(clipLeft, 0, clipWidth, leftImage.getHeight()));
		g.drawImage(rightImage, 0, 0, null);
		
		return newImage;
	}

	public static void main(String a[]) throws IOException {
		String leftStripDirectory = "./"; //"D:/uhdcircles/volumetric_frames";
		String rightStripDirectory = "D:/uhdcircles/volumetric_frames/strip_fix";
		String resultDirectory = "./results/";
		File dir = new File(rightStripDirectory);
		// loop through all images in the rightStrip
		for (File f: dir.listFiles()) {
			String name = f.getName();
			if (!name.endsWith(".png") || name.indexOf("cloud_frame_") == -1) {
				continue; // skip the file.
			}
			String leftImagePath = leftStripDirectory + "/" + name;
			File leftImageFile = new File(leftImagePath);
			if (!leftImageFile.exists()) {
				System.out.println("Left image file not found: " + leftImagePath);
				continue;
			}
			BufferedImage leftImage = ImageIO.read(leftImageFile);
			BufferedImage rightImage = ImageIO.read(f);
			BufferedImage result = combine(leftImage, rightImage);
			ImageIO.write(result, "png", new File(resultDirectory + name));
		}
	}
}