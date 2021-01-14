package org.aiupscaling.ui;

import javax.imageio.ImageIO;
import java.io.IOException;
import javax.swing.*;
import java.awt.*;
import java.util.*;
import java.io.File;
import java.awt.image.BufferedImage;
import org.aiupscaling.*;

public class ImagePanels extends JPanel implements ImagePanelsDragListener {
	private LinkedList<LabelledImagePanel> images;

	public ImagePanels() {
		images = new LinkedList<LabelledImagePanel>();
		LabelledImagePanel mainImage = new LabelledImagePanel("Source", this);
		images.add(mainImage);
		images.add(new LabelledUpscaledImagePanel("Curved Edge Upscaler", new CurvedEdgeDetectingUpscaler(), this));
		images.add(new LabelledUpscaledImagePanel("Neighbour Blend Upscaler", new NeighbourBlendUpscaler(), this));
		images.add(new LabelledUpscaledImagePanel("Edge Detecting Upscaler", new EdgeDetectingUpscaler(), this));
		
		setLayout(new GridLayout(2, 2));
		for (LabelledImagePanel panel: images) {
			add(panel);
		}
	}

	@Override
	public void addToOffset(int dx, int dy) {
		for (LabelledImagePanel panel: images) {
			panel.addToOffset(dx, dy);
		}
	}

	public void zoomIn() {
		for (LabelledImagePanel panel: images) {
			panel.zoomIn();
		}
	}

	public void zoomOut() {
		for (LabelledImagePanel panel: images) {
			panel.zoomOut();
		}
	}

	public void loadImage(File f) {
		try {
			BufferedImage image = ImageTypeSanitizer.convertType(ImageIO.read(f));
			for (LabelledImagePanel panel: images) {
				panel.setImage(image);
			}
			getPaintingOnBufferedImage();
		}
		catch (IOException ioe) {
			ioe.printStackTrace();
			JOptionPane.showMessageDialog(null, "Unable to load image from " + f.getAbsolutePath());
		}
	}

	private BufferedImage getPaintingOnBufferedImage() {
		BufferedImage result = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_3BYTE_BGR);
		paintComponent(result.getGraphics());
		return result;
	}
}