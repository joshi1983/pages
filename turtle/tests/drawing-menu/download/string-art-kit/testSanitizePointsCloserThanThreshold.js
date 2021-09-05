import { sanitizePointsCloserThanThreshold } from '../../../../modules/drawing-menu/download/string-art-kit/sanitizePointsCloserThanThreshold.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';

export function testSanitizePointsCloserThanThreshold(logger) {
	const points = [new Vector2D(0, 0), new Vector2D(0.1, 0), new Vector2D(1, 0), new Vector2D(5, 5)];
	const sanitizedPoints = sanitizePointsCloserThanThreshold(points, 0.2);
	if (sanitizedPoints.length !== 3)
		logger(`Expected 3 points but got ${sanitizedPoints.length}.  The points were ${sanitizedPoints.join(', ')}`);
};