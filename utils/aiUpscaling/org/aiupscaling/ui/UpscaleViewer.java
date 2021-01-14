package org.aiupscaling.ui;

import javax.swing.*;
import java.awt.event.*;
import java.awt.BorderLayout;

public class UpscaleViewer extends JFrame {
	private ImagePanels imagesPanel;

	public UpscaleViewer() {
		setSize(500, 500);
		imagesPanel = new ImagePanels();
		initMenu();
		setLayout(new BorderLayout());
		add(imagesPanel, BorderLayout.CENTER);
		setVisible(true);
	}

	private void initMenu() {
		JMenuBar menuBar = new JMenuBar();
		JMenu fileMenu = new JMenu("File");
		JMenuItem openImage = new OpenFileCommand(imagesPanel).createJMenuItem();
		fileMenu.add(openImage);
		menuBar.add(fileMenu);

		JMenu viewMenu = new JMenu("View");
		JMenuItem zoomIn = new ZoomInCommand(imagesPanel).createJMenuItem();
		JMenuItem zoomOut = new ZoomOutCommand(imagesPanel).createJMenuItem();
		viewMenu.add(zoomIn);
		viewMenu.add(zoomOut);
		menuBar.add(viewMenu);
		
		setJMenuBar(menuBar);
	}

	public static void main(String a[]) {
		new UpscaleViewer().setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
}