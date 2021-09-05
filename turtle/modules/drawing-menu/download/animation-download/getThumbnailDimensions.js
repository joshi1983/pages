function getMaxSize() {
	const dialogBody = document.querySelector('.dialog-body');
	if (dialogBody === null)
		return 100;
	const box = dialogBody.getBoundingClientRect();
	if (box.height < 400 || box.width < 500)
		return 100;
	else {
		return Math.round(Math.min(box.height - 200, box.width - 200));
	}
}

export function getThumbnailDimensions(outCanvas, inCanvas) {
	const inCanvasBox = {'width': inCanvas.width, 'height': inCanvas.height};
	const s = getMaxSize();
	let maxWidth = s;
	let maxHeight = s;
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