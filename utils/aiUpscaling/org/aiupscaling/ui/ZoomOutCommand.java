package org.aiupscaling.ui;

public class ZoomOutCommand extends Command {
	private ImagePanels viewer;

	public ZoomOutCommand(ImagePanels viewer) {
		super("Zoom Out");
		this.viewer = viewer;
	}

	public void actionPerformed() {
		viewer.zoomOut();
	}
}