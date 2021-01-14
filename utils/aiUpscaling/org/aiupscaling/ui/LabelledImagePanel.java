package org.aiupscaling.ui;

import java.awt.image.BufferedImage;
import javax.swing.JPanel;
import javax.swing.JLabel;
import java.awt.BorderLayout;

public class LabelledImagePanel extends JPanel {
	private ImagePanel imagePanel;

	public LabelledImagePanel(String title, ImagePanelsDragListener dragListener) {
		JLabel label = new JLabel(title);
		imagePanel = new ImagePanel(dragListener);
		setLayout(new BorderLayout());
		add(BorderLayout.NORTH, label);
		add(BorderLayout.CENTER, imagePanel);
	}

	public void addToOffset(int dx, int dy) {
		imagePanel.addToOffset(dx, dy);
	}

	public void setImage(BufferedImage image) {
		imagePanel.setImage(image);
	}

	public void zoomIn() {
		imagePanel.zoomIn();
	}

	public void zoomOut() {
		imagePanel.zoomOut();
	}
}