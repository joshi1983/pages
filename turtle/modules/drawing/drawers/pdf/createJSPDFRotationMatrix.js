import { isNumber } from '../../../isNumber.js';
import { Vector2D } from '../../vector/Vector2D.js';

export function createJSPDFRotationMatrix(Matrix, angle) {
	if (!isNumber(angle))
		throw new Error('angle must be a number.  Not: ' + angle);
	// math explained at: https://en.wikipedia.org/wiki/Rotation_matrix
	const rotation = new Matrix(
		Math.cos(angle), Math.sin(angle),
		-Math.sin(angle), Math.cos(angle),
		0, 0);
	return rotation;
};