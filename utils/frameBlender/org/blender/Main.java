package org.blender;

import java.awt.image.BufferedImage;
import java.awt.Graphics;
import javax.imageio.ImageIO;
import java.io.*;
import java.util.*;

public class Main {
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
	
	private static void printRatios(double [] ratios) {
		System.out.println("Ratios for length " + ratios.length);
		for (int i = 0; i < ratios.length; i++) {
			System.out.println(i + ": " + ratios[i]);
		}
	}
	
	private static String getDirectoryFromFilePath(String filename) {
		// get the directory from the filename.
		int index = filename.lastIndexOf("/");
		if (index == -1)
			return ".";
		else
			return filename.substring(0, index);
	}

	private static void processBlendableFrames(String directory) throws IOException {
		HashMap<Integer, BlendFrameCluster> clusters = BlendFrameCluster.getBlendClustersFromDirectory(directory);
		// blend the clusters.
		// loop through each cluster.
		for (BlendFrameCluster cluster: clusters.values())
		{
			// blend all frames in the cluster and save result.
			BufferedImage[] frames = cluster.getFrames();
			BufferedImage result = ImageBlender.blendImages(frames);
			System.out.println("result file name would be: " + cluster.getResultFileName());
			ImageIO.write(result, "png", new File(cluster.getResultFileName()));
		}
	}

	public static void main(String a[]) throws Exception {
		processBlendableFrames("D:/uhdcircles/volumetric_frames");
	}
}