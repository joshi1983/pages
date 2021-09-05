import { optimizeGradientReferences } from './optimizeGradientReferences.js';

export function optimizeDrawing(drawing) {
	drawing = optimizeGradientReferences(drawing);
	return drawing;
};