import { BoundingBox } from './BoundingBox.js';
import { Colour } from '../../Colour.js';
import { optimizeArcsInPath } from './drawing_optimization/optimizeArcsInPath.js';
import { PathShape } from './shapes/PathShape.js';
import { pathToCircle } from './drawing_optimization/pathToCircle.js';
import { removeHiddenShapesNearTop } from './drawing_optimization/hiding/removeHiddenShapesNearTop.js';
import { ShapeStyle } from './shapes/style/ShapeStyle.js';
import { Transparent } from '../../Transparent.js';
import { Vector2DLayer } from './Vector2DLayer.js';
import { VectorDrawing } from './VectorDrawing.js';

export class Vector2DDrawing extends VectorDrawing {
	constructor(otherDrawing) {
		super(otherDrawing);
		this.foreground = new Vector2DLayer();
		this.turtleDisplay = new Vector2DLayer();
		if (otherDrawing !== undefined) {
			if (otherDrawing.foreground !== undefined)
				this.foreground.addShapes(otherDrawing.foreground, false);
		}
	}

	addForegroundShape(shape, tryMerge) {
		super.addForegroundShape(shape);
		this.foreground.addShape(shape, tryMerge);
	}

	addForegroundShapes(shapes, tryMerge) {
		if (tryMerge === undefined)
			tryMerge = true;
		shapes.forEach(shape => this.addForegroundShape(shape, tryMerge));
	}

	assign(otherDrawing) {
		if (!(otherDrawing instanceof Vector2DDrawing))
			throw new Error('otherDrawing must be an instance of Vector2DDrawing');
		this.foreground.assign(otherDrawing.foreground);
		this.setScreenColor(otherDrawing.getScreenColor());
	}

	clearScreen() {
		super.clearScreen();
		this.foreground.clear();
		this.turtleDisplay.clear();
	}

	clone() {
		return new Vector2DDrawing(this);
	}

	closePath() {
		this.foreground.closePath();
	}

	countTaintedShapes() {
		return this.foreground.countTaintedShapes();
	}

	disconnect() {
		this.foreground.disconnect();
		this.turtleDisplay.disconnect();
		this.foreground = undefined;
		this.turtleDisplay = undefined;
	}

	drawAsSingleLayer(vector2DDrawer, camera) {
		const layersToDraw = [this.background, this.foreground, this.turtleDisplay];
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

	getNonTurtleShapes() {
		const result = [];
		const layersToGetShapesFrom = [this.background, this.foreground];
		layersToGetShapesFrom.forEach(function(layer) {
			layer.shapes.forEach(function(shape) {
				result.push(shape);
			});
		});
		return result;
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
		const result = new Vector2DDrawing(this);
		result.foreground.removeTaintedShapes();
		return result;
	}

	hasAnythingToClear() {
		return super.hasAnythingToClear() || this.foreground.hasAnythingToClear();
	}

	hasTaintedShapes() {
		return this.countTaintedShapes() !== 0;
	}

	static getLayerCount() {
		return 3;
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
};