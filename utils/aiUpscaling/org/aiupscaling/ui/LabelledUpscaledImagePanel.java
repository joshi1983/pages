package org.aiupscaling.ui;

import org.aiupscaling.*;
import java.awt.image.BufferedImage;

public class LabelledUpscaledImagePanel extends LabelledImagePanel {
	private Upscaler upscaler;

	public LabelledUpscaledImagePanel(String label, Upscaler upscaler, ImagePanelsDragListener dragListener) {
		super(label, dragListener);
		this.upscaler = upscaler;
		zoomOut();
	}

	@Override
	public void setImage(BufferedImage image) {
		super.setImage(this.upscaler.upscale(image));
	}
}