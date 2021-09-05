import { Colour } from '../../Colour.js';
import { fetchText } from '../../fetchText.js';
import { formatDegreesValue } from './post-script/formatDegreesValue.js';
import { formatPointsValue } from './post-script/formatPointsValue.js';
import { getDeclaration } from './post-script/getDeclaration.js';
import { getScreenFillColorPostScript } from './post-script/getScreenFillColorPostScript.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { MathCommands } from '../../command-groups/MathCommands.js';
import { PageSize } from './post-script/PageSize.js';
import { processFillableShapeStyle } from './post-script/processFillableShapeStyle.js';
import { StringBuffer } from '../../StringBuffer.js';
import { toPostScriptLineCap } from './post-script/toPostScriptLineCap.js';
import { Transparent } from '../../Transparent.js';
import { updateStrokeStyle } from './post-script/updateStrokeStyle.js';
import { Vector } from '../vector/Vector.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';
import { Vector3D } from '../vector/Vector3D.js';
await Colour.asyncInit();

const lineProc = await fetchText('content/drawing/download/post-script/line.eps.dat') + '\n';
const circleProc = await fetchText('content/drawing/download/post-script/circle.eps.dat') + '\n';
const ellipseProc = await fetchText('content/drawing/download/post-script/ellipse.eps.dat') + '\n';
const rotatedEllipseProc = await fetchText('content/drawing/download/post-script/rotatedellipse.eps.dat') + '\n';

export class PostScriptDrawer extends Vector2DDrawer {
	constructor(scale, translation, pageSize) {
		if (typeof scale !== 'number')
			throw new Error('scale must be a number but got ' + scale);
		if (!(translation instanceof Vector))
			throw new Error('translation must be a Vector but got ' + translation);
		if (!(pageSize instanceof PageSize))
			throw new Error('pageSize must be a PageSize.  Not: ' + pageSize);

		super();
		this.scale = scale;
		this.translation = new Vector3D(translation);
		this.lines = new StringBuffer();
		this.color = new Colour('#000');
		this.screenColor = Transparent;
		this.clear();
		this.setDimensions(pageSize.getWidthPostScriptUnits(), pageSize.getHeightPostScriptUnits());
	}

	addLine(line) {
		if (typeof line !== 'string')
			throw new Error('line must be a string.  Not: ' + line);
		this.lines.append(line + '\n');
	}

	clear() {
		this.lines.clear();
		this.usesLineProc = false;
		this.usesCircleProc = false;
		this.usesEllipseProc = false;
		this.usesRotatedEllipseProc = false;
		this.currentLineCap = toPostScriptLineCap(LineCap.Butt);
		this.currentLineJoin = LineJoinStyle.Miter;
		this.lineWidth = 1;
	}

	clearScreen(color) {
		this.screenColor = color;
		this.clear();
	}

	drawArc(arcShape) {
		this.addLine('newpath');
		const radius = arcShape.radius * this.scale;
		let endAngleDegrees = (Math.PI * 1.5 - arcShape.rotationRadians) / MathCommands.degToRadianScale;
		let startAngleDegrees = endAngleDegrees - arcShape.angle / MathCommands.degToRadianScale;
		this.addLine(`${this.getTransformedAndFormattedPoint(arcShape.position)} ${formatPointsValue(radius)} ${startAngleDegrees} ${endAngleDegrees} arc`);
		updateStrokeStyle(this, arcShape.style);
		this.addLine('stroke');
	}

	drawCircle(circleShape) {
		this.addLine(`${this.getTransformedAndFormattedPoint(circleShape.position)} ${circleShape.radius * this.scale} circle`);
		processFillableShapeStyle(this, circleShape.style);
		this.usesCircleProc = true;
	}

	drawEllipse(ellipseShape) {
		if (ellipseShape.rotationRadians === 0) {
			this.addLine(`${this.getTransformedAndFormattedPoint(ellipseShape.position)} ${formatPointsValue(ellipseShape.radius1 * this.scale)} ${formatPointsValue(ellipseShape.radius2 * this.scale)} ellipse`);
			this.usesEllipseProc = true;
		}
		else {
			this.addLine(`${this.getTransformedAndFormattedPoint(ellipseShape.position)} ${formatPointsValue(ellipseShape.radius1 * this.scale)} ${formatPointsValue(ellipseShape.radius2 * this.scale)} ${formatDegreesValue(-ellipseShape.rotationRadians / MathCommands.degToRadianScale)} rotatedellipse`);
			this.usesRotatedEllipseProc = true;
		}
		processFillableShapeStyle(this, ellipseShape.style);
	}

	drawLine(lineShape) {
		const pos = lineShape.position;
		const pos2 = lineShape.endPoint;
		updateStrokeStyle(this, lineShape.style);
		this.addLine(`${this.getTransformedAndFormattedPoint(pos)} ${this.getTransformedAndFormattedPoint(pos2)} line`);
		this.usesLineProc = true;
	}

	drawPath(pathShape) {
		this.addLine('newpath');
		for (let i = 0; i < pathShape.elements.length; i++) {
			const pathElement = pathShape.elements[i];
			if (pathElement instanceof Vector) {
				let s = `${this.getTransformedAndFormattedPoint(pathElement)} `;
				if (i === 0)
					this.addLine(`${s}moveto`);
				else
					this.addLine(`${s}lineto`);
			}
			else
				throw new Error('PostScriptDrawer does not support anything except Vector elements in a path');
		}
		if (pathShape.isClosed)
			this.addLine('closepath');
		processFillableShapeStyle(this, pathShape.style);
	}

	getCircleProc() {
		if (this.usesCircleProc)
			return circleProc;
		else
			return '';
	}

	getEllipseProc() {
		if (this.usesEllipseProc)
			return ellipseProc;
		else
			return '';
	}

	getLineProc() {
		if (this.usesLineProc)
			return lineProc;
		else
			return '';
	}

	getRotatedEllipseProc() {
		if (this.usesRotatedEllipseProc)
			return rotatedEllipseProc;
		else
			return '';
	}

	getTransformedAndFormattedPoint(v) {
		v = this.transform(v);
		return `${formatPointsValue(v.getX())} ${formatPointsValue(v.getY())}`;
	}

	/*
	This may not set dimensions to the ones specified but it'll set to the
	nearest match in standard page sizes.
	*/
	setDimensions(width, height) {
		if (typeof width !== 'number')
			throw new Error('width must be a number but got ' + width);
		if (typeof height !== 'number')
			throw new Error('height must be a number but got ' + height);
		this.pageSize = PageSize.getPageSizeClosestToDimensions(width, height);
		this.width = this.pageSize.getWidthPostScriptUnits();
		this.height = this.pageSize.getHeightPostScriptUnits();
	}

	transform(v) {
		return v.plus(this.translation).multiply(this.scale);
	}

	toString() {
		const result = new StringBuffer();
		result.append(getDeclaration(this) + '\n');
		result.append(this.getLineProc());
		result.append(this.getCircleProc());
		result.append(this.getEllipseProc());
		result.append(this.getRotatedEllipseProc());
		result.append(getScreenFillColorPostScript(this));
		result.append(this.lines.toString());
		result.append('\nshowpage');
		return result.toString();
	}
};