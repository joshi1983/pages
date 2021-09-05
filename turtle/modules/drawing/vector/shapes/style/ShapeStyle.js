import { AlphaColour } from '../../../../AlphaColour.js';
import { Colour } from '../../../../Colour.js';
import { EventDispatcher } from '../../../../EventDispatcher.js';
import { Gradient } from '../gradients/Gradient.js';
import { isNumber } from '../../../../isNumber.js';
import { LineCap } from './LineCap.js';
import { LineJoinStyle } from './LineJoinStyle.js';
import { Transparent } from '../../../../Transparent.js';

export class ShapeStyle extends EventDispatcher {
	constructor(otherStyle) {
		super(['change']);
		if (otherStyle === undefined)
			otherStyle = {};
		else if (otherStyle instanceof Colour || otherStyle === Transparent) {
			throw new Error('test');
			otherStyle = {
				'pen': {
					'color': otherStyle
				}
			};
		}
		// some defaults
		this.pen = {
			'color': new Colour('#000'),
			'width': 1,
			'lineCap': LineCap.Round,
			'lineJoinStyle': LineJoinStyle.Miter,
			'gradient': undefined,
			'miterLimit': 10
		};
		this.font = {
			'size': 30,
			'family': 'Arial'
		};
		this.material = {
			'fill': {
				'color': Transparent,
				'gradient': undefined
			}
		};
		this.assignFromObject(otherStyle);
	}

	assignFromObject(objectProperties) {
		if (objectProperties instanceof ShapeStyle) {
			this.assignFromShapeStyle(objectProperties);
		}
		else {
			if (objectProperties === null || typeof objectProperties !== 'object' || objectProperties instanceof Array)
				throw new Error('object required');
			if (typeof objectProperties.pen === 'object') {
				const pen = objectProperties.pen;
				if (pen.color instanceof Colour || pen.color instanceof AlphaColour || pen.color === Transparent)
					this.pen.color = pen.color;
				if (typeof pen.width === 'number')
					this.setPenWidth(pen.width);
				if (isNumber(pen.miterLimit) && pen.miterLimit >= 0)
					this.setMiterLimit(pen.miterLimit);
				if (pen.gradient !== undefined)
					this.setPenGradient(pen.gradient);
				if (Number.isInteger(pen.lineJoinStyle))
					this.setLineJoinStyle(pen.lineJoinStyle);
				if (Number.isInteger(pen.lineCap))
					this.setLineCap(pen.lineCap);
			}
			if (typeof objectProperties.font === 'object') {
				const font = objectProperties.font;
				if (typeof font.family === 'string')
					this.setFontFamily(font.family);
				if (typeof font.size === 'number')
					this.setFontSize(font.size);
			}
			if (typeof objectProperties.material === 'object') {
				const material = objectProperties.material;
				if (typeof material.fill === 'object') {
					const fill = material.fill;
					if (fill.color === Transparent || fill.color instanceof Colour || fill.color instanceof AlphaColour)
						this.setFillColor(fill.color);
					if (fill.gradient !== undefined)
						this.setFillGradient(fill.gradient);
				}
			}
		}
	}

	assignFromShapeStyle(shapeStyle) {
		this.setPenWidth(shapeStyle.getPenWidth());
		this.setLineJoinStyle(shapeStyle.getLineJoinStyle());
		this.setMiterLimit(shapeStyle.getMiterLimit());
		this.setLineCap(shapeStyle.getLineCap());
		this.setFillColor(shapeStyle.getFillColor());
		this.setFillGradient(shapeStyle.getFillGradient());
		this.setFontSize(shapeStyle.getFontSize());
		this.setFontFamily(shapeStyle.getFontFamily());
		this.setPenColor(shapeStyle.getPenColor());
		this.setPenGradient(shapeStyle.getPenGradient());
	}

	clearFill() {
		this.setFillColor(Transparent);
		this.setFillGradient(undefined);
	}

	deepClone() {
		const result = new ShapeStyle(this);
		const fillColor = this.getFillColor();
		if (fillColor !== Transparent) {
			result.material.fill.color = AlphaColour.cloneColourOrAlphaColour(fillColor);
		}
		if (this.getFillGradient() !== undefined)
			result.material.fill.gradient = this.getFillGradient().deepClone();
		if (this.getPenGradient() !== undefined)
			result.pen.gradient = this.getPenGradient().deepClone();

		const penColor = this.getPenColor();
		if (penColor !== Transparent)
			result.pen.color = AlphaColour.cloneColourOrAlphaColour(penColor);
		result.pen.lineJoinStyle = this.pen.lineJoinStyle;
		return result;
	}

	disconnect() {
		this.removeAllEventListeners();
		this.pen = undefined;
		this.material = undefined;
		this.font = undefined;
	}

	dispatchChange(name) {
		this._dispatchEvent('change', {'name': name});
	}

	equals(other) {
		if (!(other instanceof ShapeStyle))
			return false;
		const gradient = this.getFillGradient();
		if (gradient === undefined) {
			if (other.getFillGradient() !== undefined)
				return false;
		}
		else if (!gradient.equals(other.getFillGradient()))
			return false;
		if (this.getPenWidth() !== 0) {
			if (this.pen.lineJoinStyle !== other.pen.lineJoinStyle)
				return false;
			const penGradient = this.getPenGradient();
			if (penGradient === undefined) {
				if (other.getPenGradient() !== undefined)
					return false;
			}
			else if (!penGradient.equals(other.getPenGradient()))
				return false;
			if (this.getMiterLimit() !== other.getMiterLimit())
				return false;
		}
		return this.getFillColor().equals(other.getFillColor()) &&
			this.getPenColor().equals(other.getPenColor()) &&
			this.getPenWidth() === other.getPenWidth() &&
			this.getFont() === other.getFont();
	}

	// The return value may be null or a Colour.
	getFillColor() {
		return this.material.fill.color;
	}

	getFillGradient() {
		return this.material.fill.gradient;
	}

	getFont() {
		return this.font.size + 'px ' + this.font.family;
	}

	getFontFamily() {
		return this.font.family;
	}

	getFontSize() {
		return this.font.size;
	}

	getLineCap() {
		return this.pen.lineCap;
	}

	getLineJoinStyle() {
		return this.pen.lineJoinStyle;
	}

	getMiterLimit() {
		return this.pen.miterLimit;
	}

	getPenColor() {
		return this.pen.color;
	}

	getPenGradient() {
		return this.pen.gradient;
	}

	getPenWidth() {
		return this.pen.width;
	}

	isFillVisible() {
		const fillGradient = this.getFillGradient();
		if (fillGradient !== undefined)
			return true;
		const fillColor = this.getFillColor();
		if (fillColor === Transparent)
			return false;
		if (fillColor instanceof Colour)
			return true;

		return !AlphaColour.isTransparent(fillColor);
	}

	isPenVisible() {
		if (this.pen.color === Transparent && this.pen.gradient === undefined)
			return false;
		return this.pen.width > 0;
	}

	setFillColor(c) {
		if (c === null)
			throw new Error('c must be Colour or Transparent. c passed as null');
		else if (c !== Transparent && !(c instanceof Colour) && !(c instanceof AlphaColour))
			throw new Error('c must be either transparent, Colour or an AlphaColour.  c = ' + c);
		else if ((c === Transparent && this.material.fill.color === Transparent) ||
		(c !== Transparent && c.equals(this.material.fill.color)))
			return; // nothing to change.

		if (this.material.fill.color === Transparent || c === Transparent)
			this.material.fill.color = c;
		else
			this.material.fill.color = c;
		this.dispatchChange('fill-color');
	}

	setFillGradient(gradient, forceChange) {
		if (gradient !== undefined && !(gradient instanceof Gradient))
			throw new Error('gradient must either be undefined or an instance of Gradient.  Specified was: ' + gradient);
		if (forceChange !== true && (gradient === this.material.fill.gradient || (gradient !== undefined && gradient.equals(this.material.fill.gradient))))
			return; // nothing to change.

		this.material.fill.gradient = gradient;
	}

	setFontFamily(familyName) {
		if (typeof familyName !== 'string')
			throw new Error('familyName must be a string.  Not: ' + familyName);
		this.font.family = familyName;
	}

	setFontSize(newSize) {
		if (typeof newSize !== 'number')
			throw new Error('font size must be a number.  Not: ' + newSize);

		this.font.size = newSize;
	}

	setLineCap(newLineCap) {
		if (!Number.isInteger(newLineCap))
			throw new Error('newLineCap must be an integer.  Not: ' + newLineCap);
		if (newLineCap !== this.pen.lineCap) {
			this.pen.lineCap = newLineCap;
			this.dispatchChange('line-cap');
		}
	}

	setLineJoinStyle(newLineJoinStyle) {
		if (typeof newLineJoinStyle !== 'number')
			throw new Error('newLineJoinStyle must be a number');
		if (newLineJoinStyle !== this.pen.lineJoinStyle) {
			this.pen.lineJoinStyle = newLineJoinStyle;
			this.dispatchChange('line-join-style');
		}
	}

	setMiterLimit(newLimit) {
		if (newLimit !== this.pen.miterLimit) {
			this.pen.miterLimit = newLimit;
			this.dispatchChange('miter-limit');
		}
	}

	setPenColor(c) {
		if (c !== Transparent && !(c instanceof AlphaColour) && !(c instanceof Colour))
			throw new Error('c must be an AlphaColour, Colour, or Transparent.  Not: ' + c);
		else if (c === null)
			throw new Error('can not set pen color to null');
		if (!c.equals(this.pen.color)) {
			if (this.pen.color instanceof Colour && c instanceof Colour)
				this.pen.color.assign(c);
			else
				this.pen.color = c;
			this.dispatchChange('pen-color');
		}
	}

	setPenGradient(gradient, forceChange) {
		if (gradient !== undefined && !(gradient instanceof Gradient))
			throw new Error('gradient must either be undefined or an instance of Gradient.  Specified was: ' + gradient);
		if (forceChange !== true && (gradient === this.pen.gradient || (gradient !== undefined && gradient.equals(this.pen.gradient))))
			return; // nothing to change.

		this.pen.gradient = gradient;
	}

	setPenWidth(w) {
		if (!isNumber(w))
			throw new Error('w must be a number');
		else if (w !== this.pen.width) {
			this.pen.width = w;
			this.dispatchChange('pen-width');
		}
	}

	transformBy(camera) {
		const result = this.deepClone();
		const scale = camera.getZoomScale();
		result.setPenWidth(result.getPenWidth() * scale);
		result.setFontSize(result.getFontSize() * scale);
		if (this.material.fill.gradient !== undefined)
			result.material.fill.gradient = this.material.fill.gradient.transformBy(camera);
		if (this.pen.gradient !== undefined)
			result.pen.gradient = this.pen.gradient.transformBy(camera);
		return result;
	}
};