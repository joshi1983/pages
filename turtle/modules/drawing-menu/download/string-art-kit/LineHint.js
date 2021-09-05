import { Vector2D } from '../../../drawing/vector/Vector2D.js';

/*
A LineHint is a little like LineSegmentShape except specific to the string art kit.
It is for connecting 2 points that have been filtered for distinct positions.
*/
export class LineHint {
	constructor(p1, p2) {
		if (!(p1 instanceof Vector2D))
			throw new Error('p1 must be a Vector2D but got ' + p1);
		if (!(p2 instanceof Vector2D))
			throw new Error('p2 must be a Vector2D but got ' + p2);
		this.p1 = p1;
		this.p2 = p2;
	}
};