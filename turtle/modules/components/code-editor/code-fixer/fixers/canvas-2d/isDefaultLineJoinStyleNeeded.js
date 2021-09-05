import { isDefaultLineCapNeeded } from './isDefaultLineCapNeeded.js';

export function isDefaultLineJoinStyleNeeded(token) {
	return isDefaultLineCapNeeded(token);
};