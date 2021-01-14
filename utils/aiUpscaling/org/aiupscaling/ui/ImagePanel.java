package org.aiupscaling.ui;

import javax.swing.JPanel;
import java.awt.image.BufferedImage;
import java.awt.Graphics;
import java.awt.Color;
import java.awt.Cursor;

public class ImagePanel extends JPanel {
	private BufferedImage image;
	private double scale = 1;
	private double x, y;

	public ImagePanel(BufferedImage image, ImagePanelsDragListener dragListener) {
		this.image = image;
		new ImagePanelMouseDragListener(this, dragListener);
	}

	public ImagePanel(ImagePanelsDragListener dragListener) {
		this(null, dragListener);
	}

	public void addToOffset(int x, int y) {
		this.x += x * 1.0 / scale;
		this.y += y * 1.0 / scale;
		repaint();
	}

	public void paint(Graphics g) {
		if (image != null) {
			super.paint(g);
			g.drawImage(image, (int)(x * scale), (int)(y * scale), (int)(image.getWidth() * scale), (int)(image.getHeight() * scale), Color.BLACK, null);
		}
	}

	public void setImage(BufferedImage image) {
		this.image = image;
		repaint();
	}

	private void setScale(double scale) {
		this.scale = scale;
		System.out.println("new scale = " + scale);
		repaint();
	}

	public void zoomIn() {
		setScale(scale * 2.0);
	}

	public void zoomOut() {
		setScale(scale * 0.5);
	}
}