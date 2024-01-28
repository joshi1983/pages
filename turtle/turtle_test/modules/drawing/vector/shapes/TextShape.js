import { BoundingBox } from '../BoundingBox.js';
import { LineSegmentShape } from './LineSegmentShape.js';
import { Shape } from './Shape.js';
import { ShapeStyle } from './style/ShapeStyle.js';
import { Transparent } from '../../../Transparent.js';

export class TextShape extends Shape {
	constructor(position, rotationRadians, text, style) {
		if (typeof text !== 'string')
			throw new Error('text must be a string.  Not: ' + text);
		super(position, style);
		this.text = text;
		this.rotationRadians = rotationRadians;
	}

	getBoundingBox() {
		const len = this.style.getPenWidth() * 0.5 + this.style.getFontSize() * 0.5 * this.text.length;
		const height = this.style.getPenWidth() * 0.5 + this.style.getFontSize() * 1.6;
		const style = new ShapeStyle();
		style.setPenWidth(height);
		const lineSegment = new LineSegmentShape(this.position, this.position.getDisplacedByPolar(Math.PI * 0.5 - this.rotationRadians, len), style);
		return lineSegment.getBoundingBox();
	}

	isVisible() {
		return this.style.getFillColor() !== Transparent || this.style.isPenVisible();
	}

	transformBy(camera) {
		return new TextShape(camera.transform(this.position),
			this.rotationRadians, this.text, this.style.transformBy(camera));
	}
};