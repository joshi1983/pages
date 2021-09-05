import { BoundingBox } from './BoundingBox.js';
import { Colour } from '../../Colour.js';
import { equalColours } from '../../colour/equalColours.js';
import { EventDispatcher } from '../../EventDispatcher.js';
import { isNumber } from '../../isNumber.js';
import { optimizeArcsInPath } from './drawing_optimization/optimizeArcsInPath.js';
import { PathShape } from './shapes/PathShape.js';
import { pathToCircle } from './drawing_optimization/pathToCircle.js';
import { removeHiddenShapesNearTop } from './drawing_optimization/hiding/removeHiddenShapesNearTop.js';
import { Transparent } from '../../Transparent.js';
import { Vector2DLayer } from './Vector2DLayer.js';

export class VectorDrawing extends EventDispatcher {
	constructor(otherDrawing) {
		super(['change', 'addForegroundShape', 'clearScreen', 'setScreenColor']);
		if (otherDrawing === undefined) {
			this.screenColor = new Colour('#fff');
			this.setDimensions(100, 100);
		}
		else {
			this.setScreenColor(otherDrawing.screenColor);
			this.setDimensions(otherDrawing.width, otherDrawing.height);
		}
		this.turtleDisplay = new Vector2DLayer();
		this.foreground = new Vector2DLayer();
		if (otherDrawing !== undefined) {
			if (otherDrawing.foreground !== undefined)
				this.foreground.addShapes(otherDrawing.foreground, false);
		}
	}

	addForegroundShape(shape, tryMerge) {
		this._dispatchEvent('addForegroundShape', {'shape': shape});
		this.foreground.addShape(shape, tryMerge);
	}

	addForegroundShapes(shapes, tryMerge) {
		if (tryMerge === undefined)
			tryMerge = true;
		shapes.forEach(shape => this.addForegroundShape(shape, tryMerge));
	}

	assign(otherDrawing) {
		if (!(otherDrawing instanceof VectorDrawing))
			throw new Error('otherDrawing must be an instance of VectorDrawing');
		this.foreground.assign(otherDrawing.foreground);
		this.setScreenColor(otherDrawing.getScreenColor());
	}

	clearScreen() {
		this.setScreenColor(new Colour('#fff'));
		this._dispatchEvent('clearScreen', {});
		this.foreground.clear();
		this.turtleDisplay.clear();
	}

	clone() {
		return new VectorDrawing(this);
	}

	closePath() {
		this.foreground.closePath();
	}

	countTaintedShapes() {
		return this.foreground.countTaintedShapes();
	}

	/* this reduces references to help JavaScript's garbage collector recognize parts 
	of the drawing as not needed in RAM any longer.
	*/
	disconnect() {
		this.foreground.disconnect();
		this.turtleDisplay.disconnect();
		this.foreground = undefined;
		this.removeAllEventListeners();
		this.turtleDisplay = undefined;
	}

	drawAsSingleLayer(vector2DDrawer, camera) {
		const layersToDraw = [this.foreground, this.turtleDisplay];
		vector2DDrawer.setDimensions(this.width, this.height);
		vector2DDrawer.clear();
		vector2DDrawer.clearScreen(this.getScreenColor());
		layersToDraw.forEach(function(layer) {
			vector2DDrawer.drawLayer(layer, camera);
		});
	}

	async drawerReady() {
		const shapes = this.foreground.shapes;
		for (let i = 0; i < shapes.length; i++) {
			const shape = shapes[i];
			if (shape.drawerReady !== undefined) {
				await shape.drawerReady();
			}
		}
	}
	getBoundingBox() {
		return new BoundingBox(this.foreground.shapes.map(s => s.getBoundingBox()));
	}

	static getLayerCount() {
		return 3;
	}

	getNonTurtleShapes() {
		const result = [];
		const layersToGetShapesFrom = [this.foreground];
		layersToGetShapesFrom.forEach(function(layer) {
			layer.shapes.forEach(function(shape) {
				result.push(shape);
			});
		});
		return result;
	}

	getScreenColor() {
		return this.screenColor;
	}

	/*
	Assumes caller won't mutate the resulting Array.
	If you need to make changes to the array, be sure to clone or deep clone 
	sufficiently before mutating your copy of the array so no bugs are introduced.
	*/
	getShapesArray() {
		return this.foreground.shapes;
	}

	getWithoutTaintedShapes() {
		const result = new VectorDrawing(this);
		result.foreground.removeTaintedShapes();
		return result;
	}

	hasAnythingToClear() {
		if (this.screenColor === Transparent ||
		!this.screenColor.equals(new Colour('#fff')))
			return true;
		return this.foreground.hasAnythingToClear();
	}

	hasTaintedShapes() {
		return this.countTaintedShapes() !== 0;
	}

	optimizeTopShapes() {
		const shapes = this.foreground.shapes;
		const lastShape = shapes[shapes.length - 1];
		if (lastShape instanceof PathShape) {
			optimizeArcsInPath(lastShape);
			if (lastShape instanceof PathShape) {
				const circle = pathToCircle(lastShape);
				if (circle !== undefined) {
					shapes[shapes.length - 1] = circle;
				}
			}
		}
		removeHiddenShapesNearTop(shapes);
	}

	setDimensions(width, height) {
		if (!isNumber(width))
			throw new Error('width');
		if (!isNumber(height))
			throw new Error('height');

		this.width = width;
		this.height = height;
	}

	setScreenColor(c) {
		if (!(c instanceof Colour) && c !== Transparent)
			throw new Error(`setScreenColor requires c to be a Colour or Transparent and can not be null for a complete drawing.  c was specified as ${c}`);
		if (!equalColours(c, this.screenColor)) {
			this.screenColor = c;
			super._dispatchEvent('setScreenColor', {});
		}
	}
};