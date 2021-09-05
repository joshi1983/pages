import { getBestOrientation } from './getBestOrientation.js';

export function getJSPDFOptions(pdfDrawer) {
	let format = [pdfDrawer.height, pdfDrawer.width];
	return {
		"orientation": getBestOrientation(pdfDrawer),
		"unit": "in",
		"format": format
	};
};