import { PointCloudLocalStorage } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudLocalStorage.js';

export function testPointCloudLocalStorage(logger) {
	const formatSelector = document.createElement('select');
	const modeSelector = document.createElement('select');
	PointCloudLocalStorage.loadFromLocalStorage(formatSelector, modeSelector);
};