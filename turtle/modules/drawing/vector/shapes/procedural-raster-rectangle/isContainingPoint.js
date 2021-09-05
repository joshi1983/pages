import { Vector2D } from '../../Vector2D.js';

/*
biasToTrue is a value that should be close to 0 which is used to help isContainingPoint return true when
floating point calculation error is the only reason to return false.
*/
export function isContainingPoint(rect, vector2d, biasToTrue) {
	if (biasToTrue === undefined)
		biasToTrue = 0;
	vector2d = vector2d.minus(new Vector2D(rect.x, rect.y));
	vector2d = Vector2D.rotate(vector2d, -rect.headingRadians);
	if (vector2d.getX() + biasToTrue < 0 || vector2d.getX() - biasToTrue > rect.width)
		return false;
	if (vector2d.getY() + biasToTrue < 0 || vector2d.getY() - biasToTrue > rect.height)
		return false;
	return true;
};