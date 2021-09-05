import { ArcShape } from '../../../vector/shapes/ArcShape.js';

export function getArcs(elements) {
	return elements.filter(e => e instanceof ArcShape);
};