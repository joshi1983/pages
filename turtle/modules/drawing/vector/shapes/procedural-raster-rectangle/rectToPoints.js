import { Vector2D } from '../../Vector2D.js';

export function rectToPoints(rect) {
	const offsets = [
		new Vector2D(0, 0),
		new Vector2D(rect.width, 0),
		new Vector2D(rect.width, rect.height),
		new Vector2D(0, rect.height)];
	const rectP = new Vector2D(rect.x, rect.y);
	return offsets.map((offset) => rectP.plus(Vector2D.rotate(offset, rect.headingRadians)));
};