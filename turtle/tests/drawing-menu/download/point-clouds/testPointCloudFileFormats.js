import { PointCloudFileFormats } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudFileFormats.js';

export function testPointCloudFileFormats(logger) {
	const selectElement = document.createElement('select');
	PointCloudFileFormats.populateSelect(selectElement);
};