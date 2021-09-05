import { Camera } from './Camera.js';
import { CircleShape } from './shapes/CircleShape.js';
import { Colour } from '../../Colour.js';
import { LineSegmentShape } from './shapes/LineSegmentShape.js';
import { PathShape } from './shapes/PathShape.js';
import { ShapeStyle } from './shapes/style/ShapeStyle.js';
import { Transparent } from '../../Transparent.js';
import { Vector2DLayer } from './Vector2DLayer.js';
const black = new Colour('#000');

export class Vector2DDrawer {
	constructor(screenColour) {
		if (screenColour === undefined)
			screenColour = new Colour('#fff');

		this.setScreenColor(screenColour);
	}

	circleToSphere(shape) {
		const style = shape.style.deepClone();
		style.setPenWidth(1);
		style.setPenColor(black);
		style.clearFill();
		return new CircleShape(shape.position, shape.radius, style);
	}

	clear() {
		throw new Error('clear not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	clearScreen(c) {
		throw new Error('clearScreen not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	drawArc() {
		throw new Error('drawArc not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	drawBoundingBox(box) {
		const points = box.toPathVectors();
		const style = new ShapeStyle();
		style.setPenWidth(0.5);
		style.setPenColor(new Colour('#f00'));
		const pathShape = new PathShape(points, true, style);
		this.drawPath(pathShape);
	}

	drawCircle() {
		throw new Error('drawCircle not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	drawEllipse() {
		throw new Error('drawEllipse not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	drawLayer(layer, camera) {
		if (!(layer instanceof Vector2DLayer))
			throw new Error('drawLayer requires layer to be a Vector2DLayer');
		if (camera !== undefined && !(camera instanceof Camera))
			throw new Error('camera must either be undefined or a Camera');

		if (layer.getFillColor() !== Transparent)
			this.clearScreen(layer.getFillColor());

		let shapes = layer.shapes.slice(0); // sliced so we don't mutate layer.shapes.
		if (camera !== undefined && !camera.isTrivial()) {
			// not using Array's map method here for efficiency's sake
			for (let i = 0; i < shapes.length; i++) {
				shapes[i] = shapes[i].transformBy(camera);
			}
		}
		this.drawShapes(shapes);
	}

	drawLine() {
		throw new Error('drawLine not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	drawPath(path) {
		for (let i = 1; i < path.elements.length; i++) {
			const lineSegment = new LineSegmentShape(path.elements[i - 1], path.elements[i], path.style);
			this.drawLine(lineSegment);
		}
	}

	drawShape(shape) {
		let methodName = shape.constructor.name;
		methodName = `draw${methodName.substring(0, methodName.length - 5)}`;
		if (typeof this[methodName] === 'function')
			this[methodName](...arguments);
		else if (shape instanceof LineSegmentShape)
			this.drawLine(...arguments);
		else
			throw new Error('Unable to draw shape: ' + shape + ', methodName: ' + methodName);
	}

	drawShapes(shapes) {
		if (!(shapes instanceof Array))
			throw new Error('shapes must be an Array of Shape class');
		for (let i = 0; i < shapes.length; i++) {
			this.drawShape(shapes[i]);
		}
	}

	drawSphere(shape) {
		// A 2D drawer generally can't draw 3D shapes so draw a similar 2D shape.
		this.drawCircle(Vector2DDrawer.sphereToCircle(shape));
	}

	drawText(textShape) {
		throw new Error('drawText not implemented yet.  A subclass of Vector2DDrawer should implement this.');
	}

	setScreenColor(c) {
		if (!(c instanceof Colour) && c !== Transparent)
			throw new Error('setScreenColor requires c to be a Colour or Transparent');
		this.screenColour = c;
	}

	static sphereToCircle(sphere) {
		const style = sphere.style.deepClone();
		style.setPenWidth(1);
		style.setPenColor(black);
		style.clearFill();
		return new CircleShape(sphere.position, sphere.radius, style);
	}
};