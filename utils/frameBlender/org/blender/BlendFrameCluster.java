package org.blender;

import java.util.*;
import java.io.*;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;


public class BlendFrameCluster {
	public static final String framePrefix = "frame_";
	public int frameIndex;
	public HashSet<String> filenames;

	public BlendFrameCluster(int frameIndex) {
		this.frameIndex = frameIndex;
		filenames = new HashSet<String>();
	}

	public static boolean isBlendFrame(String filename) {
		if (!filename.endsWith(".png") || filename.indexOf(framePrefix) == -1)
			return false;

		int index = filename.indexOf(framePrefix);
		filename = filename.substring(index + (framePrefix.length()));

		return filename.indexOf("_") != -1;
	}

	public static int getFrameIndexFrom(String filename) {
		int index = filename.indexOf("frame_");
		filename = filename.substring(0, filename.length() - 4).substring(index + (framePrefix.length()));
		index = filename.indexOf("_");
		if (index > 0) {
			filename = filename.substring(0, index);
		}

		return Integer.parseInt(filename);
	}

	public static HashMap<Integer, BlendFrameCluster> getBlendClustersFromDirectory(String directory, int minFrameIndex, int maxFrameIndex) {
		File dir = new File(directory);
		HashMap<Integer, BlendFrameCluster> clusters = new HashMap<Integer, BlendFrameCluster>();
		for (File f: dir.listFiles()) {
			String name = f.getAbsolutePath();
			if (BlendFrameCluster.isBlendFrame(name)) {
				// does it have 2 numbers?
				int index = BlendFrameCluster.getFrameIndexFrom(name);

				// Skip frames that are out of the specified range.
				if (index < minFrameIndex || index > maxFrameIndex)
					continue;

				if (clusters.get(index) == null)
					clusters.put(index, new BlendFrameCluster(index));
				
				BlendFrameCluster cluster = clusters.get(index);
				cluster.addBlurFrame(name);
			}
		}
		return clusters;
	}
	
	public String getResultFileName() {
		String filename = filenames.iterator().next();
		String dir = filename;
		String name;
		int index = filename.lastIndexOf("/");
		if (index != -1) {
			dir = filename.substring(0, index);
			name = filename.substring(index + 1);
		}
		else {
			name = filename;
			dir = "";
		}
		index = name.lastIndexOf("_");
		name = name.substring(0, index) + ".png";

		return dir + "/" + name;
	}

	public void addBlurFrame(String filename) {
		filenames.add(filename);
	}

	public BufferedImage[] getFrames() throws IOException {
		BufferedImage []result = new BufferedImage[filenames.size()];
		String[] filenamesArray = filenames.toArray(new String[ filenames.size() ]);
		Arrays.sort(filenamesArray);
		// loop through the filenames in alphabetic order.
		for (int i = 0; i < result.length; i++) {
			result[i] = Main.convertType(ImageIO.read(new File(filenamesArray[i])));
		}
		
		return result;
	}
}
