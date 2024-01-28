import { drawingToPoints } from './drawingToPoints.js';

export function canDrawingBeExportedToPointCloud(drawing) {
	const points = drawingToPoints(drawing);
	return points.some(p => p.vector.getZ() !== 0);
};