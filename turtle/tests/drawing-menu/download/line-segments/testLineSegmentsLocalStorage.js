import { LineSegmentsLocalStorage } from
'../../../../modules/drawing-menu/download/line-segments/LineSegmentsLocalStorage.js';

export function testLineSegmentsLocalStorage(logger) {
	const formatSelector = document.createElement('select');
	const modeSelector = document.createElement('select');
	LineSegmentsLocalStorage.loadFromLocalStorage(formatSelector, modeSelector);
};