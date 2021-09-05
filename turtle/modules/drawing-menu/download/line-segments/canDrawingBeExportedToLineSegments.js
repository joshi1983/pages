import { drawingToLineSegments } from './drawingToLineSegments.js';

export function canDrawingBeExportedToLineSegments(drawing) {
	const lines = drawingToLineSegments(drawing, 90);
	return lines.some(line => line.point1.getZ() !== 0 || line.point2.getZ() !== 0);
};