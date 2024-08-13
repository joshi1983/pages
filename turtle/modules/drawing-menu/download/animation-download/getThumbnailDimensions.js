export function getThumbnailDimensions(outCanvas, inCanvas) {
	const inCanvasBox = inCanvas.getBoundingClientRect();
	const maxWidth = 100;
	const maxHeight = 100;
	let width;
	let height;
	if (inCanvasBox.width > inCanvasBox.height) {
		width = maxWidth;
		height = Math.round(maxWidth * inCanvasBox.height / inCanvasBox.width);
	}
	else {
		width = Math.round(maxWidth * inCanvasBox.width / inCanvasBox.height);
		height = maxHeight;
	}
	outCanvas.setAttribute('width', width);
	outCanvas.setAttribute('height', height);
	return {
		'width': width,
		'height': height
	};
};