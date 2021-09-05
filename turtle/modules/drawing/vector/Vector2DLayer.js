import { Colour } from '../../Colour.js';
import { EventDispatcher } from '../../EventDispatcher.js';
import { PathShape } from './shapes/PathShape.js';
import { Shape } from './shapes/Shape.js';
import { Transparent } from '../../Transparent.js';
import { tryMergeShapePair } from './drawing_optimization/tryMergeShapePair.js';

export class Vector2DLayer extends EventDispatcher {
	constructor(otherLayer) {
		super(['change']);
		this.clear();
		if (otherLayer instanceof Vector2DLayer) {
			this.addShapes(otherLayer);
			this.setFillColor(otherLayer.getFillColor());
		}
	}

	addShape(shape, tryMerge) {
		if (typeof tryMerge !== 'boolean')
			tryMerge = true;
		if (this.shapes.length !== 0 && tryMerge === true) {
			const result = tryMergeShapePair(this.shapes[this.shapes.length - 1], shape);
			if (result instanceof Shape) {
				this.shapes[this.shapes.length - 1] = result;
				return;
			}
		}
		this.shapes.push(shape);
	}

	addShapes(shapes, tryMerge) {
		if (shapes instanceof Vector2DLayer)
			shapes = shapes.shapes;
		if (!(shapes instanceof Array))
			throw new Error('shapes must be an Array or a Vector2DLayer');

		for (let i = 0; i < shapes.length; i++) {
			const shape = shapes[i];
			this.addShape(shape, tryMerge);
		}
	}

	assign(otherLayer) {
		if (!(otherLayer instanceof Vector2DLayer))
			throw new Error('otherLayer must be an instance of Vector2DLayer');

		this.shapes = [];
		/*
		Not using this.addShapes(otherLayer.shapes) here for a little more efficiency.
		We don't need to check if pairs can be merged since otherLayer would have already run through those steps.
		*/
		const shapes = otherLayer.shapes;
		for (let i = 0; i < shapes.length; i++)
			this.shapes.push(shapes[i]);
	}

	clear() {
		this.fillColor = Transparent;
		this.shapes = [];
	}

	closePath() {
		const lastShape = this.shapes[this.shapes.length - 1];
		if (lastShape === undefined)
			throw new Error('There is no shape or path to close');
		if (!(lastShape instanceof PathShape))
			throw new Error('There is no path to close');
		lastShape.isClosed = true;
	}

	countTaintedShapes() {
		return this.shapes.filter(s => s.isTainted()).length;
	}

	// similar to dispose method from some other classes in WebLogo.
	// Calling disconnect() is done to help garbage collection of 
	// unused memory by reducing references that aren't needed anymore.
	disconnect() {
		this.shapes.forEach(function(shape) {
			shape.disconnect();
		});
		this.shapes = [];
		this.removeAllEventListeners();
	}

	getFillColor() {
		return this.fillColor;
	}

	hasAnythingToClear() {
		return this.shapes.length !== 0;
	}

	removeTaintedShapes() {
		this.shapes = this.shapes.filter(s => !s.isTainted());
	}

	setFillColor(c) {
		if (c !== Transparent && !(c instanceof Colour))
			throw new Error('fill color must either be Transparent or a Colour');
		if (this.fillColor === Transparent && c === Transparent)
			return; // nothing to change
		if (this.fillColor !== Transparent && this.fillColor.equals(c))
			return; // nothing to change
		this.fillColor = c;
		this._dispatchEvent('change', {'name': 'fill-color'});
	}
};