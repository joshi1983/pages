package org.aiupscaling.ui;

import java.awt.event.*;
import java.awt.Cursor;
import javax.swing.JPanel;

public class ImagePanelMouseDragListener extends MouseAdapter implements MouseMotionListener {
	private ImagePanelsDragListener panelListener;
	private int previousX, previousY;
	private JPanel panel;

	public ImagePanelMouseDragListener(ImagePanel panel, ImagePanelsDragListener panelListener) {
		this.panelListener = panelListener;
		panel.addMouseMotionListener(this);
		panel.addMouseListener(this);
		this.panel = panel;
	}

	@Override
	public void mousePressed(MouseEvent e) {
		previousX = e.getX();
		previousY = e.getY();
		this.panel.setCursor(new Cursor(Cursor.MOVE_CURSOR));
	}

	@Override
	public void mouseDragged(MouseEvent e) {
		int x = e.getX();
		int y = e.getY();

		panelListener.addToOffset(x - previousX, y - previousY);

		previousX = x;
		previousY = y;
	}

	@Override
	public void mouseMoved(MouseEvent e) {
		
	}
}