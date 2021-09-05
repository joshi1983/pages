import { filterConnectedVectors } from './filterConnectedVectors.js';
import { getDistinctArcCenterPositions } from './getDistinctArcCenterPositions.js';
import { Vector } from '../../../vector/Vector.js';
import { Vector2D } from '../../../vector/Vector2D.js';

export function getUTurnRectInfo(elements) {
	if (!(elements instanceof Array))
		throw new Error(`elements must be an Array.  Not: ${elements}`);
	const arcs = filterConnectedVectors(elements);
	const cornerRadius = arcs[0].radius;
	const height = cornerRadius * 2;
	const centerPositions = getDistinctArcCenterPositions(arcs);
	const p1 = centerPositions[0];
	const p2 = centerPositions[1];
	const centerPairSeparation = Vector.euclideanDistance(p1.minus(p2).coords);
	const width = height + centerPairSeparation;
	const rotationRadians = Math.atan2(p1.getY() - p2.getY(), p1.getX() - p2.getX());
	const offset = new Vector2D(-width / 2, -height / 2);
	const rotatedOffset = Vector2D.rotate(offset, rotationRadians);
	return {
		'width': width,
		'height': height,
		'cornerRadius': cornerRadius,
		'position': p1.plus(p2).multiply(0.5).plus(rotatedOffset),
		'rotationRadians': rotationRadians
	};
};