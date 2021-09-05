import { AlphaColour } from '../../AlphaColour.js';
import { clampRadianAngle } from '../../clampRadianAngle.js';
import { Colour } from '../../Colour.js';
import { drawPath } from './svg/drawPath.js';
import { encodeUrl } from './svg/encodeUrl.js';
import { getEllipseDiagonalRadius } from '../vector/shapes/math/getEllipseDiagonalRadius.js';
import { isNumber } from '../../isNumber.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { lineToCircle } from './svg/lineToCircle.js';
import { MathCommands } from '../../command-groups/MathCommands.js';
import { Shape } from '../vector/shapes/Shape.js';
import { SmartRounder } from '../vector/shapes/math/SmartRounder.js';
import { StringBuffer } from '../../StringBuffer.js';
import { Transparent } from '../../Transparent.js';
import { Vector } from '../vector/Vector.js';
import { Vector2D } from '../vector/Vector2D.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();
const webLogoComment = '<!-- Created with WebLogo -->';

export class SVGVector2DDrawer extends Vector2DDrawer {
	static startTagIndex = 1;
	static xmlns = 'http://www.w3.org/2000/svg';
	static gTagIndex = SVGVector2DDrawer.startTagIndex + 1;
	static generalIndentation = '  ';

	constructor(width, height) {
		super();
		this.setDimensions(width, height);
		this._defs = [];
		this.clearScreen(this.screenColour);
		this.bodyTags = [];
	}

	_getDeclaration() {
		return '<?xml version="1.0" encoding="utf-8"?>';
	}

	_getDefs() {
		const result = new StringBuffer();
		if (this._defs.length !== 0) {
			result.append('<defs>');
			for (let i = 0; i < this._defs.length; i++) {
				result.append(this._defs[i].toSVGMarkup());
			}
			result.append('</defs>');
		}
		return result.toString();
	}

	_getGTag(gID) {
		const gAttr = gID === undefined ? '' : 'id="' + gID + '"';
		return ' <g ' + gAttr + ' transform="translate(' + this.rounder.formatNumber(this.width / 2) + ' ' + this.rounder.formatNumber(this.height / 2) + '), scale(1,-1)">';
	}

	_getMeta() {
		return '';
		//return `<metadata></metadata>`;
		/*
		FIXME: This should credit WebLogo.
		*/
	}

	_getStartTag() {
		const result = new StringBuffer();
		result.append(`<svg xmlns="${SVGVector2DDrawer.xmlns}" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.width}" height="${this.height}"`);
		if (this.screenColour !== Transparent)
			result.append(` style="background-color:${this.screenColour}"`);
		return result.toString() + '>';
	}

	addGradientDefinition(gradient) {
		const id = gradient.getId();
		for (let i = 0; i < this._defs.length; i++) {
			if (this._defs[i].getId() === id)
				return; // nothing to add because it is already in this._defs.
		}
		this._defs.push(gradient);
	}

	clear() {
		this.bodyTags = [];
		this._defs = [];
	}

	clearScreen(c) {
		if ((c instanceof Colour) || (c === Transparent))
			this.setScreenColor(c);
		this.clear();
	}

	drawArc(arc) {
		const centre = arc.position;
		const offset = -arc.rotationRadians - Math.PI * 0.5;
		const start = centre.getDisplacedByPolar(offset - arc.angle, arc.radius);
		const end = centre.getDisplacedByPolar(offset, arc.radius);
		const largeArcFlag = arc.angle < Math.PI ? 0 : 1;
		this.pushTag('<path d="M ' + this.rounder.formatNumber(end.getX()) + ' ' + this.rounder.formatNumber(end.getY()) +
			' A ' + this.rounder.formatNumber(arc.radius) + ' ' +
			this.rounder.formatNumber(arc.radius) + ' 0 ' + this.rounder.formatNumber(largeArcFlag) + ' 0 ' + 
			this.rounder.formatNumber(start.getX()) + ' ' +
		   this.rounder.formatNumber(start.getY()) + '" ' + this.getStyleAttributes(arc.style) + '/>');		
	}

	drawCircle(circle) {
		const centre = circle.position;
		this.pushTag('<circle cx="' + this.rounder.formatNumber(centre.getX()) + '" cy="' +
		   this.rounder.formatNumber(centre.getY()) + '" r="' +
		   this.rounder.formatNumber(circle.radius) + '"' + this.getStyleAttributes(circle.style) + '/>');		
	}

	drawEllipse(ellipse) {
		if (ellipse.style.getFillGradient() === undefined) {
			let s = '<ellipse rx="' + this.rounder.formatNumber(ellipse.radius1) + '" ry="' + 
			this.rounder.formatNumber(ellipse.radius2) + '"' + this.getStyleAttributes(ellipse.style);
			s += ' transform="' + this.getTranslation(ellipse.position);
			if (ellipse.rotationRadians !== 0) {
				s += ' rotate(' + (-ellipse.rotationRadians) / MathCommands.degToRadianScale + ')';
			}
			s += '"';
			this.pushTag(s + '/>');
		}
		else {
			const p = ellipse.getLowestPoint();
			const tinyOffset = Math.min(ellipse.radius1, ellipse.radius2) * 0.001;
			let s = `<path d="M ${this.rounder.formatNumber(p.getX())} ${this.rounder.formatNumber(p.getY())}` +
			` a ${this.rounder.formatNumber(ellipse.radius1)} ${
				this.rounder.formatNumber(ellipse.radius2)
			} ${this.rounder.formatNumber(-ellipse.rotationRadians / MathCommands.degToRadianScale)} 1 0 ${tinyOffset} 0" ` +
				this.getStyleAttributes(ellipse.style);
			this.pushTag(s + '/>');
		}
	}

	drawEllipseArc(eArc) {
		const centre = eArc.position;
		const offset = -eArc.rotationRadians - Math.PI * 0.5 - eArc.startAngle;
		const rotationDegrees = -eArc.rotationRadians * 180 / Math.PI;
		const startAngle = offset - eArc.angle;
		const startRadius = getEllipseDiagonalRadius(startAngle + eArc.rotationRadians, eArc.radius1, eArc.radius2);
		const start = centre.getDisplacedByPolar(startAngle, startRadius);
		const endRadius = getEllipseDiagonalRadius(offset+ eArc.rotationRadians, eArc.radius1, eArc.radius2);
		const end = centre.getDisplacedByPolar(offset, endRadius);
		const largeArcFlag = eArc.angle < Math.PI ? 0 : 1;
		this.pushTag('<path d="M ' + this.rounder.formatNumber(end.getX()) + ' ' + this.rounder.formatNumber(end.getY()) +
			' A ' + 
			this.rounder.formatNumber(eArc.radius1) + ' ' + 
			this.rounder.formatNumber(eArc.radius2) + ` ${rotationDegrees} ` + largeArcFlag + ' 0 ' + 
			this.rounder.formatNumber(start.getX()) + ' ' +
		   this.rounder.formatNumber(start.getY()) + '" ' + this.getStyleAttributes(eArc.style) + '/>');
	}

	drawLine(line) {
		const pos = line.position;
		const pos2 = line.endPoint;
		if (pos.equals(pos2) && line.style.getLineCap() === 'round') {
			this.drawCircle(lineToCircle(line));
			return;
		}
		this.pushTag('<line x1="' + this.rounder.formatNumber(pos.getX()) + '" y1="' +
			this.rounder.formatNumber(pos.getY()) + '" x2="' + this.rounder.formatNumber(pos2.getX()) + '" y2="' +
			this.rounder.formatNumber(pos2.getY()) + '" ' + this.getStrokeStyle(line.style) + ' />');
	}

	drawPath(path) {
		drawPath(this, path);
	}

	drawRasterRectangle(rasterShape) {
		let transformAttributes = 'transform="' + this.getTranslation(rasterShape.position);
		transformAttributes += `scale(1 -1) rotate(${rasterShape.rotationRadians * 180 / Math.PI}) translate(${-rasterShape.width * 0.5}, ${-rasterShape.height})"`;
		let opacityAttribute = '';
		if (rasterShape.opacity < 1) {
			opacityAttribute = ` opacity="${rasterShape.opacity}"`;
		}
		this.pushTag(`<image width="${rasterShape.width}" height="${rasterShape.height}" xlink:href="${encodeUrl(rasterShape.dataUrl)}" ${transformAttributes}${opacityAttribute}  preserveAspectRatio="none"/>`);
	}

	drawText(textShape) {
		const basicAttributes = `font-size="${textShape.style.getFontSize()}" font-family="${textShape.style.getFontFamily()}" ${this.getStyleAttributes(textShape.style)}`;
		let transformAttributes = 'transform="' + this.getTranslation(textShape.position);
		transformAttributes += 'scale(1 -1) ';
		const rotationAngleDegrees = textShape.rotationRadians * 180 / Math.PI - 90;
		if (rotationAngleDegrees !== 0)
			transformAttributes += `rotate(${rotationAngleDegrees})`;
		transformAttributes += '"';

		this.pushTag(`<text ${transformAttributes} ${basicAttributes}>${textShape.text}</text>`);
	}

	getStrokeStyle(style) {
		const pw = style.getPenWidth();
		let result = ' stroke-width="' + this.rounder.formatNumber(pw) + '"';
		if (pw !== 0) {
			const gradient = style.getPenGradient();
			const penColor = style.getPenColor();
			if (gradient === undefined) {
				if (penColor === Transparent) {
					result += ' stroke-opacity="0%"';
				}
				else {
					result += ' stroke="' + penColor.to6DigitHTMLCode() + '"';
					if (penColor instanceof AlphaColour)
						result += ` stroke-opacity="${AlphaColour.getOpacityPercentage(penColor)}%"`;
				}
			}
			else {
				this.addGradientDefinition(gradient);
				result += ` stroke="url(#${gradient.getId()})"`;
			}
		}
		if (style.isPenVisible()) {
			const lineJoinStyle = style.getLineJoinStyle();
			if (lineJoinStyle !== LineJoinStyle.Miter) {
				result += ` stroke-linejoin="${LineJoinStyle.getNameFor(lineJoinStyle)}"`;
			}
			const lineCap = style.getLineCap();
			if (lineCap !== LineCap.Butt)
				result += ` stroke-linecap="${LineCap.getNameFor(lineCap)}"`;
		}
		return result;
	}

	getStyleAttributes(style) {
		let result = this.getStrokeStyle(style);
		const gradient = style.getFillGradient();
		const fillColor = style.getFillColor();
		if (gradient !== undefined) {
			this.addGradientDefinition(gradient);
			result += ` fill="url(#${gradient.getId()})"`;
		}
		else if (fillColor === Transparent)
			result += ' fill="none"';
		else {
			result += ' fill="' + fillColor.to6DigitHTMLCode() + '"';
			if (fillColor instanceof AlphaColour)
				result += ` fill-opacity="${AlphaColour.getOpacityPercentage(fillColor)}%"`;
		}
		return result;
	}

	getTranslation(position) {
		if (position.getX() !== 0 || position.getY() !== 0)
			return `translate(${this.rounder.formatNumber(position.getX())} ${this.rounder.formatNumber(position.getY())}) `;
		else
			return '';
	}

	pushTag(line) {
		this.bodyTags.push(SVGVector2DDrawer.generalIndentation + line);
	}

	setDimensions(width, height) {
		if (!isNumber(width))
			throw new Error('width must be a number');
		if (!isNumber(height))
			throw new Error('height must be a number');

		this.width = width;
		this.height = height;
		this.rounder = new SmartRounder(Math.max(width, height) / 1000000);
	}

	setScreenColor(c) {
		super.setScreenColor(c);
	}

	toString(options) {
		let gID = undefined;
		let gTag = undefined;
		if (typeof options === 'object') {
			if (typeof options.gID === 'string') {
				gTag = this._getGTag(options.gID);
			}
			if (typeof options.GTag === 'string') {
				gTag = options.GTag;
			}
		}
		if (gTag === undefined) {
			gTag = this._getGTag();
		}
		const startTags = [this._getDeclaration(), webLogoComment, this._getStartTag(), this._getMeta(), this._getDefs(), gTag].join('\n');
		const bodyTags = this.bodyTags.join('\n');
		const endTags = '\n </g>\n</svg>';
		return startTags + '\n' + bodyTags + endTags;
	}
};