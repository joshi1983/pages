package org.aiupscaling.ui;

public class ZoomInCommand extends Command {
	private ImagePanels viewer;

	public ZoomInCommand(ImagePanels viewer) {
		super("Zoom In");
		this.viewer = viewer;
	}

	public void actionPerformed() {
		viewer.zoomIn();
	}
}