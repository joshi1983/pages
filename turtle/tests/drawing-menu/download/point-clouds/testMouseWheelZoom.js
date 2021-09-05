import { mouseWheelZoom } from
'../../../../modules/drawing-menu/download/point-clouds/mouseWheelZoom.js';
import { PointCloudPreviewer } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudPreviewer.js';

export function testMouseWheelZoom(logger) {
	const container = document.createElement('div');
	const previewer = new PointCloudPreviewer(container, []);
	mouseWheelZoom(container, previewer);

	// call again to test the unbinding.
	mouseWheelZoom(container, previewer);
};