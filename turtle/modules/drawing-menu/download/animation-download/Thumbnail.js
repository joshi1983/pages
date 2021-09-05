import { getThumbnailDimensions } from './getThumbnailDimensions.js';

var frameThumbnailCanvas;
var lastThumbnailPaintTime;

export class Thumbnail {
	static refreshElements() {
		frameThumbnailCanvas = document.getElementById('animation-download-frame-thumbnail');
		frameThumbnailCanvas.height = 100;
		frameThumbnailCanvas.width = 100;
		lastThumbnailPaintTime = undefined;
	}

	static notifyFrameCanvas(frameIndex, canvas) {
		const newTime = Date.now();
		// If less than 5 second passed since last canvas draw, just return.
		if (lastThumbnailPaintTime === undefined || newTime - lastThumbnailPaintTime > 5000) {
			lastThumbnailPaintTime = newTime;
			const thumbnailDimensions = getThumbnailDimensions(frameThumbnailCanvas, canvas);
			const ctx = frameThumbnailCanvas.getContext('2d');
			ctx.drawImage(canvas, 0, 0, thumbnailDimensions.width, thumbnailDimensions.height);
		}
	}
};