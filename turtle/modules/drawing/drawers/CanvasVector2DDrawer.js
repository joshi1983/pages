import { AbstractCanvasDrawer } from './AbstractCanvasDrawer.js';
import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { drawPath } from './canvas/drawPath.js';
import { drawTurtle } from '../drawTurtle.js';
import { ellipseAngleChange } from './canvas/ellipseAngleChange.js';
import { getNumCyclesForShapeAndGradient } from '../vector/shapes/gradients/getNumCyclesForShapeAndGradient.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { processBlendModesForCanvasContextFill } from './canvas/processBlendModesForCanvasContextFill.js';
import { processBlendModesForCanvasContextStroke } from './canvas/processBlendModesForCanvasContextStroke.js';
import { Transparent } from '../../Transparent.js';
import { Vector2D } from '../vector/Vector2D.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';
import { Vector3D } from '../vector/Vector3D.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

export class CanvasVector2DDrawer extends AbstractCanvasDrawer {
	constructor(canvases, width, height) {
		super(canvases, width, height);
	}

	drawArc(arcShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(arcShape.position);
		this.setShapeStyle(arcShape, ctx);
		ctx.beginPath();
		ctx.arc(translatedPos.getX(), translatedPos.getY(), arcShape.radius,
			Math.PI * 0.5 + arcShape.rotationRadians, Math.PI * 0.5 + arcShape.angle + arcShape.rotationRadians, arcShape.angle < 0);
		if (arcShape.style.isPenVisible()) {
			processBlendModesForCanvasContextStroke(arcShape.style, ctx);
			ctx.stroke();
		}
		ctx.closePath();
	}

	drawCircle(circleShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		let translatedPos = this.getTranslatedPosition(circleShape.position);
		this.setShapeStyle(circleShape, ctx);
		ctx.beginPath();
		ctx.arc(translatedPos.getX(), translatedPos.getY(), circleShape.radius, 0, 2 * Math.PI);
		ctx.closePath();
		if (circleShape.style.isFillVisible()) {
			processBlendModesForCanvasContextFill(circleShape.style, ctx);
			ctx.fill();
		}
		if (circleShape.style.isPenVisible()) {
			processBlendModesForCanvasContextStroke(circleShape.style, ctx);
			ctx.stroke();
		}
	}

	drawEllipse(ellipseShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(ellipseShape.position);
		this.setShapeStyle(ellipseShape, ctx);
		ctx.beginPath();
		ctx.ellipse(translatedPos.getX(), translatedPos.getY(),
			ellipseShape.radius1, ellipseShape.radius2, ellipseShape.rotationRadians, 0, 2 * Math.PI);
		ctx.closePath();
		if (ellipseShape.style.isFillVisible()) {
			processBlendModesForCanvasContextFill(ellipseShape.style, ctx);
			ctx.fill();
		}
		if (ellipseShape.style.isPenVisible()) {
			processBlendModesForCanvasContextStroke(ellipseShape.style, ctx);
			ctx.stroke();
		}
	}

	drawEllipseArc(ellipseArcShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(ellipseArcShape.position);
		this.setShapeStyle(ellipseArcShape, ctx);
		ctx.beginPath();
		let startAngle = Math.PI * 0.5 + ellipseArcShape.startAngle;
		let angle = startAngle + ellipseArcShape.angle;
		angle = ellipseAngleChange(angle, ellipseArcShape.radiiRatio);
		startAngle = ellipseAngleChange(startAngle, ellipseArcShape.radiiRatio);
		ctx.ellipse(translatedPos.getX(), translatedPos.getY(),
			ellipseArcShape.radius1, ellipseArcShape.radius2, ellipseArcShape.rotationRadians, startAngle, angle);
		if (ellipseArcShape.style.isPenVisible()) {
			processBlendModesForCanvasContextStroke(ellipseArcShape.style, ctx);
			ctx.stroke();
		}
		ctx.closePath();
	}

	drawLine(lineSegment, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		if (lineSegment.style.isPenVisible()) {
			let translatedPos = this.getTranslatedPosition(lineSegment.position);
			this.setShapeStyle(lineSegment, ctx);
			ctx.beginPath();
			ctx.moveTo(translatedPos.getX(), translatedPos.getY());
			translatedPos = this.getTranslatedPosition(lineSegment.endPoint);
			ctx.lineTo(translatedPos.getX(), translatedPos.getY());
			processBlendModesForCanvasContextStroke(lineSegment.style, ctx);
			ctx.stroke();
			ctx.closePath();
		}
	}

	drawOrientedCircle(circle, ctx) {
		this.drawEllipse(circle.getZProjectionShape(), ctx);
	}

	drawPath(path, ctx) {
		drawPath(this, path, ctx);
	}

	drawProceduralRasterRectangle(shape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(shape.position);
		if (shape.opacity < 1) {
			ctx.globalAlpha = shape.opacity;
		}
		const rects = shape.rects.filter(i => i.image !== undefined);
		if (rects.length !== 0)
			console.log(`rects.length = ${rects.length}`);
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			ctx.save();
			ctx.translate(
				translatedPos.getX() + rect.offsetXRatio * shape.width,
				translatedPos.getY() + rect.offsetYRatio * shape.height);
			ctx.rotate(shape.rotationRadians);
			const w = shape.width * rect.widthRatio;
			const h = shape.height * rect.heightRatio;
			ctx.drawImage(rect.image, -w * 0.5, -h, w, h);
			ctx.restore();
		}
		ctx.globalAlpha = 1;
	}

	drawRasterRectangle(shape, ctx) {
		if (shape.image === undefined)
			return; // nothing to do.  We can't draw the image.
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(shape.position);
		ctx.save();
		ctx.translate(translatedPos.getX(), translatedPos.getY());
		ctx.rotate(shape.rotationRadians);
		if (shape.opacity < 1) {
			ctx.globalAlpha = shape.opacity;
		}
		processBlendModesForCanvasContextFill(shape.style, ctx);
		ctx.drawImage(shape.image, -shape.width * 0.5, -shape.height, shape.width, shape.height);
		ctx.globalAlpha = 1;
		ctx.restore();
	}

	drawSphere(shape, ctx) {
		this.drawCircle(Vector2DDrawer.sphereToCircle(shape), ctx);
	}

	drawText(shape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		ctx.font = shape.style.getFont();
		let translatedPos = this.getTranslatedPosition(shape.position);
		ctx.save();
		ctx.translate(translatedPos.getX(), translatedPos.getY());
		ctx.rotate(shape.rotationRadians - Math.PI * 0.5);

		this.setShapeStyle(shape, ctx);
		if (shape.style.isFillVisible()) {
			processBlendModesForCanvasContextFill(shape.style, ctx);
			ctx.fillText(shape.text, 0, 0);
		}
		if (shape.style.isPenVisible()) {
			processBlendModesForCanvasContextStroke(shape.style, ctx);
			ctx.strokeText(shape.text, 0, 0);
		}
		ctx.restore();
	}

	getTranslatedPosition(pos) {
		return new Vector3D(this.width / 2 + pos.getX(), this.height / 2 - pos.getY(), 0);
	}

	pixelCoordinatesToTurtleCoordinates(v) {
		return new Vector2D(v.getX() - this.width / 2, -(v.getY() - this.height / 2));
	}

	refreshTurtle(turtleDrawState) {
		this.turtleContext.clearRect(0, 0, this.width, this.height);
		const canvas = this.canvases[2];
		if (turtleDrawState.isTurtleVisible) {
			const shapes = drawTurtle(turtleDrawState);
			const outer = this;
			shapes.forEach(function(shape) {
				outer.drawShape(shape, outer.turtleContext);
			});
			canvas.classList.remove('hidden');
		}
		else
			canvas.classList.add('hidden');
	}

	setShapeStyle(shape, ctx) {
		const shapeStyle = shape.style;
		const penGradient = shapeStyle.getPenGradient();
		if (penGradient === undefined) {
			const penColor = shapeStyle.getPenColor();
			if (penColor instanceof AlphaColour)
				ctx.strokeStyle = AlphaColour.getRGBAExpression(penColor);
			else if (penColor === Transparent)
				ctx.strokeStyle = 'rgba(0,0,0,0)';
			else
				ctx.strokeStyle = penColor.to6DigitHTMLCode();
		}
		else {
			const numCycles = getNumCyclesForShapeAndGradient(shape, penGradient);
			ctx.strokeStyle = penGradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2, numCycles);
		}
		ctx.lineWidth = shapeStyle.getPenWidth();
		const lineCap = shapeStyle.getLineCap();
		ctx.lineCap = LineCap.getNameFor(lineCap);
		ctx.lineJoin = LineJoinStyle.getNameFor(shapeStyle.getLineJoinStyle());
		if (shapeStyle.pen.lineJoinStyle === LineJoinStyle.Miter &&
		shapeStyle.isPenVisible()) {
			const miterLimit = shapeStyle.getMiterLimit();
			if (miterLimit <= 0)
				ctx.lineJoin = 'bevel';
			else
				ctx.miterLimit = miterLimit;
		}
		const fillGradient = shapeStyle.getFillGradient();
		if (fillGradient === undefined) {
			if (shapeStyle.getFillColor() !== Transparent) {
				const fillColor = shapeStyle.getFillColor();
				if (fillColor instanceof AlphaColour)
					ctx.fillStyle = AlphaColour.getRGBAExpression(fillColor);
				else
					ctx.fillStyle = fillColor.to6DigitHTMLCode();
			}
		}
		else {
			const numCycles = getNumCyclesForShapeAndGradient(shape, fillGradient);
			ctx.fillStyle = fillGradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2, numCycles);
		}
	}
}