import { LineSegmentShape } from './LineSegmentShape.js';
import { Shape } from './Shape.js';
import { ShapeStyle } from './style/ShapeStyle.js';

export class ProceduralRasterRectangleShape extends Shape {
	constructor(position, width, height, rotationRadians, procedureName, initialVariables, style) {
		if (typeof procedureName !== 'string')
			throw new Error(`procedureName must be a string.  Not: ${procedureName}`);
		super(position, style);
		this.initialVariables = initialVariables;
		this.width = width;
		this.height = height;
		this.rotationRadians = rotationRadians;
		this.minSampleWidth = 10;
		this.minSampleHeight = 10;
		this.procedureName = procedureName;
		this.rects = [];
	}

	getBoundingBox() {
		const style = new ShapeStyle();
		style.setPenWidth(this.width);
		const lineSegment = new LineSegmentShape(this.position,
			this.position.getDisplacedByPolar(Math.PI * 0.5 - this.rotationRadians, this.height), style);
		return lineSegment.getBoundingBox();
	}

	isVisible() {
		return this.width > 0 && this.height > 0;
	}

	transformBy(camera) {
		const result = new ProceduralRasterRectangleShape(camera.transform(this.position),
			this.width * camera.getZoomScale(), this.height * camera.getZoomScale(),
			this.rotationRadians, this.procedureName, this.initialVariables, this.style.transformBy(camera));
		return result;
	}
};