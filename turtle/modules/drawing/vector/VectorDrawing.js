import { Colour } from '../../Colour.js';
import { EventDispatcher } from '../../EventDispatcher.js';
import { isNumber } from '../../isNumber.js';
import { Transparent } from '../../Transparent.js';
import { Vector2DLayer } from './Vector2DLayer.js';

export class VectorDrawing extends EventDispatcher {
	constructor(otherDrawing) {
		super(['change', 'addForegroundShape', 'clearScreen', 'setScreenColor']);
		if (otherDrawing instanceof VectorDrawing) {
			this.background = new Vector2DLayer(otherDrawing.background);
			this.setDimensions(otherDrawing.width, otherDrawing.height);
		}
		else {
			this.background = new Vector2DLayer();
			this.background.setFillColor(new Colour('#fff'));
			this.setDimensions(100, 100);
		}
		const outer = this;
		this.background.addEventListener('change', function(e) {
			outer._dispatchEvent('change', e.details);
		});
	}

	addForegroundShape(shape) {
		super._dispatchEvent('addForegroundShape', {'shape': shape});
	}

	clearScreen() {
		this.background.clear();
		this.background.setFillColor(new Colour('#fff'));
		super._dispatchEvent('clearScreen', {});
	}

	/* this reduces references to help JavaScript's garbage collector recognize parts 
	of the drawing as not needed in RAM any longer.
	*/
	disconnect() {
		this.background.disconnect();
		this.removeAllEventListeners();
	}

	getScreenColor() {
		return this.background.getFillColor();
	}

	hasAnythingToClear() {
		return this.background.hasAnythingToClear();
	}

	hasTaintedShapes() {
		return false;
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
		this.background.setFillColor(c);
		super._dispatchEvent('setScreenColor', {});
	}
};