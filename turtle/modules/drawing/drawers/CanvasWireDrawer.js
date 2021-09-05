import { AbstractCanvasDrawer } from './AbstractCanvasDrawer.js';
import { arcToLineSegments } from './wire/arcToLineSegments.js';
import { circleToLineSegments } from './wire/circleToLineSegments.js';
import { ellipseArcToLineSegments } from './wire/ellipseArcToLineSegments.js';
import { ellipseToLineSegments } from './wire/ellipseToLineSegments.js';
import { pathToLineSegments } from './wire/pathToLineSegments.js';
import { PerspectiveTransformer } from './transformers/PerspectiveTransformer.js';

/*
Used for quickly drawing low-quality representations of 
3D geometry in a drawing
*/
export class CanvasWireDrawer extends AbstractCanvasDrawer {
	constructor(canvases, width, height) {
		super(canvases, width, height);
		this.transformer = new PerspectiveTransformer(width, height);
	}

	drawArc(arc, ctx) {
		this.drawLines(arcToLineSegments(arc), ctx);
	}

	drawCircle(circleShape, ctx) {
		this.drawLines(circleToLineSegments(circleShape), ctx);
	}

	drawEllipse(ellipse, ctx) {
		this.drawLines(ellipseToLineSegments(ellipse), ctx);
	}

	drawEllipseArc(ellipseArc, ctx) {
		this.drawLines(ellipseArcToLineSegments(ellipseArc), ctx);
	}

	drawLine(lineSegment, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		let transformedPos = this.transformer.transform(lineSegment.position);
		let transformedPos2 = this.transformer.transform(lineSegment.endPoint);
		if (transformedPos !== undefined && transformedPos2 !== undefined) {
			ctx.beginPath();
			ctx.moveTo(transformedPos.getX(), transformedPos.getY());
			ctx.lineTo(transformedPos2.getX(), transformedPos2.getY());
			ctx.closePath();
			ctx.stroke();
		}
	}

	drawLines(lines, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		for (let i = 0; i < lines.length; i++) {
			this.drawLine(lines[i], ctx);
		}
	}

	drawPath(path, ctx) {
		this.drawLines(pathToLineSegments(path), ctx);
	}

	drawText(textShape, ctx) {
		// FIXME: how can we do this?
	}
};