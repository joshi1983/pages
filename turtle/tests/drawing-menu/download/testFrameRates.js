import { FrameRates } from '../../../modules/drawing-menu/download/FrameRates.js';

export function testFrameRates(logger) {
	const selectElement = document.createElement('select');
	FrameRates.addOptionsToSelect(selectElement);
};