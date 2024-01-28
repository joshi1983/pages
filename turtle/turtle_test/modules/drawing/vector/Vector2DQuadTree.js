import { BoundingBox2D } from './BoundingBox2D.js';
import { Vector } from './Vector.js';
import { Vector2D } from './Vector2D.js';

export class Vector2DQuadTree {
	constructor(vectors) {
		if (!(vectors instanceof Array))
			vectors = [];
		const boundingBox2D = new BoundingBox2D();
		for (let i = 0; i < vectors.length; i++) {
			boundingBox2D.include(vectors[i]);
		}
		this.boundingBox2D = boundingBox2D;
		this.centre = boundingBox2D.getCentre(); // the pivot
		this.subtrees = [];
		this.vectors = vectors;
		if (vectors.length > 4) {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 2; j++) {
					const subtreeVectors = [];
					for (let vIndex = 0; vIndex < vectors.length; vIndex++) {
						const v = vectors[vIndex];
						if ((v.getX() < this.centre.getX()) === (i === 0) &&
						(v.getY() < this.centre.getY()) === (j === 0))
							subtreeVectors.push(v);
					}
					this.subtrees.push(new Vector2DQuadTree(subtreeVectors));
				}
			}
		}
	}

	getVectorClosestTo(pos, maxSearchRadius) {
		const points = this.getVectorsWithinCircle(pos, maxSearchRadius);
		if (points.length === 0)
			throw new Error(`Unable to find any points within ${maxSearchRadius} distance of the point ${pos}`);
		let bestDistance, result;
		for (let i = 0; i < points.length; i++) {
			const point = points[i];
			const distance = Vector.euclideanDistance(pos.minus(point));
			if (bestDistance === undefined || bestDistance > distance) {
				bestDistance = distance;
				result = point;
			}
		}
		return result;
	}

	getVectorsWithinCircle(centre, radius) {
		const centreToCentreDistance = Vector.euclideanDistance(centre.minus(this.centre));
		if (centreToCentreDistance - radius > this.boundingBox2D.getRadius())
			return []; // return none because there is no intersection.
		if (radius - centreToCentreDistance > this.boundingBox2D.getRadius())
			return this.vectors; // return all because specified circle includes entire bounding box.
		if (this.subtrees.length === 0) {
			// check individual vectors.
			const result = [];
			for (let i = 0; i < this.vectors.length; i++) {
				const v = this.vectors[i];
				if (v.minus(centre).magnitude() <= radius)
					result.push(v);
			}
			return result;
		}
		else {
			// check subtrees.
			let result = this.subtrees[0].getVectorsWithinCircle(centre, radius);
			for (let i = 1; i < 4; i++) {
				const subtreeVectors = this.subtrees[i].getVectorsWithinCircle(centre, radius);
				if (subtreeVectors.length > 0)
					result = result.concat(subtreeVectors);
			}
			return result;
		}
	}
};