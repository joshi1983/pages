let settings;
let requestRenderFromWorker;
const zoomFactor = 1.1;

function zoomIn() {
	settings.scale /= zoomFactor;
	requestRenderFromWorker();
}

function zoomOut() {
	settings.scale *= zoomFactor;
	requestRenderFromWorker();
}

function handleKeyDown(e) {
	const sideOffset = settings.scale * 20;
	if (e.which === 38) {
		// up arrow
		if (e.shiftKey) {
			settings.cy -= sideOffset;
			requestRenderFromWorker();
		}
		else
			zoomIn();
	}
	else if (e.which === 40) {
		// down arrow
		if (e.shiftKey) {
			settings.cy += sideOffset;
			requestRenderFromWorker();
		}
		else
			zoomOut();
	}
	else if (e.which === 37) {
		// left arrow
		settings.cx += sideOffset;
		requestRenderFromWorker();
	}
	else if (e.which === 39) {
		// right arrow
		settings.cx -= sideOffset;
		requestRenderFromWorker();
	}
}

export function initZoomMenu(settings_, requestRenderFromWorker_, zoomNormal) {
	settings = settings_;
	requestRenderFromWorker = requestRenderFromWorker_;
	const zoomInItem = document.getElementById('zoom-in');
	const zoomOutItem = document.getElementById('zoom-out');
	const zoomNormalItem = document.getElementById('zoom-normal');
	zoomInItem.addEventListener('click', zoomIn);
	zoomOutItem.addEventListener('click', zoomOut);
	zoomNormalItem.addEventListener('click', zoomNormal);
	window.addEventListener('keydown', handleKeyDown);
};