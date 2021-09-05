import { BoundingBox } from '../BoundingBox.js';
import { LineJoinStyle } from './style/LineJoinStyle.js';
import { LineSegmentShape } from './LineSegmentShape.js';
import { Shape } from './Shape.js';

/*
Represents many connected line segments and circular arcs that share the same style
*/
export class PathShape extends Shape {
	constructor(elements, isClosed, style) {
		if (elements.length < 2) {
			if (elements.length === 0 || (elements.length === 1 &&
			elements[0] instanceof LineSegmentShape))
				throw new Error(`There must be at least 2 elements or 1 arc shape to make a PathShape. elements.length=${elements.length}`);
		}
		if (typeof isClosed !== 'boolean')
			throw new Error('isClosed must be true or false.  Not: ' + isClosed);
		let position = elements[0];
		if (position instanceof Shape)
			position = position.position;

		super(position, style);
		this.elements = elements.slice(0);
		this.isClosed = isClosed;
	}

	containsNonPoints() {
		return this.elements.some(p => p instanceof Shape);
	}

	getBoundingBox() {
		const result = new BoundingBox();
		for (let i = 0; i < this.elements.length; i++) {
			const element = this.elements[i];
			if (element instanceof Shape)
				result.include(element.getBoundingBox());
			else if (this.style.getLineJoinStyle() === LineJoinStyle.Miter) {
				if (i >= 1) {
					let previousPoint = this.elements[i - 1];
					if (previousPoint instanceof Shape)
						previousPoint = previousPoint.getEndPoint();
					const lineSegment = new LineSegmentShape(previousPoint, element, this.style);
					result.include(lineSegment.getBoundingBox());
				}
			}
			else
				result.include(BoundingBox.createCubeBox(element, this.style.getPenWidth() * 0.5));
		}
		return result;
	}

	getEndPoint() {
		if (this.elements[this.elements.length - 1] instanceof Shape)
			return this.elements[this.elements.length - 1].getEndPoint();
		else
			return this.elements[this.elements.length - 1];
	}

	getStartPoint() {
		if (this.elements[0] instanceof Shape)
			return this.elements[0].getStartPoint();
		else
			return this.elements[0];
	}

	isVisible() {
		return this.style.isPenVisible() ||
			this.style.isFillVisible();
	}

	transformBy(camera) {
		return new PathShape(this.elements.map(function(p) {
			if (p instanceof Shape)
				return p.transformBy(camera);
			else
				return camera.transform(p);
		}), this.isClosed, this.style.transformBy(camera));
	}
};