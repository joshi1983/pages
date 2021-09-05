import { AbstractCanvasDrawer } from './AbstractCanvasDrawer.js';
import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { drawPath } from './canvas/drawPath.js';
import { drawTurtle } from '../drawTurtle.js';
import { ellipseAngleChange } from './canvas/ellipseAngleChange.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { Transparent } from '../../Transparent.js';
import { Vector } from '../vector/Vector.js';
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
		this.setShapeStyle(arcShape.style, ctx);
		ctx.beginPath();
		ctx.arc(translatedPos.getX(), translatedPos.getY(), arcShape.radius,
			Math.PI * 0.5 + arcShape.rotationRadians, Math.PI * 0.5 + arcShape.angle + arcShape.rotationRadians, arcShape.angle < 0);
		if (arcShape.style.isPenVisible())
			ctx.stroke();
		ctx.closePath();
	}

	drawCircle(circleShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		let translatedPos = this.getTranslatedPosition(circleShape.position);
		this.setShapeStyle(circleShape.style, ctx);
		ctx.beginPath();
		ctx.arc(translatedPos.getX(), translatedPos.getY(), circleShape.radius, 0, 2 * Math.PI);
		ctx.closePath();
		if (circleShape.style.isFillVisible())
			ctx.fill();
		if (circleShape.style.isPenVisible())
			ctx.stroke();
	}

	drawEllipse(ellipseShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(ellipseShape.position);
		this.setShapeStyle(ellipseShape.style, ctx);
		ctx.beginPath();
		ctx.ellipse(translatedPos.getX(), translatedPos.getY(),
			ellipseShape.radius1, ellipseShape.radius2, ellipseShape.rotationRadians, 0, 2 * Math.PI);
		ctx.closePath();
		if (ellipseShape.style.isFillVisible())
			ctx.fill();
		if (ellipseShape.style.isPenVisible())
			ctx.stroke();
	}

	drawEllipseArc(ellipseArcShape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(ellipseArcShape.position);
		this.setShapeStyle(ellipseArcShape.style, ctx);
		ctx.beginPath();
		let startAngle = Math.PI * 0.5 + ellipseArcShape.startAngle;
		let angle = startAngle + ellipseArcShape.angle;
		angle = ellipseAngleChange(angle, ellipseArcShape.radiiRatio);
		startAngle = ellipseAngleChange(startAngle, ellipseArcShape.radiiRatio);
		ctx.ellipse(translatedPos.getX(), translatedPos.getY(),
			ellipseArcShape.radius1, ellipseArcShape.radius2, ellipseArcShape.rotationRadians, startAngle, angle);
		if (ellipseArcShape.style.isPenVisible())
			ctx.stroke();
		ctx.closePath();
	}

	drawLine(lineSegment, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		if (lineSegment.style.isPenVisible()) {
			let translatedPos = this.getTranslatedPosition(lineSegment.position);
			this.setShapeStyle(lineSegment.style, ctx);
			ctx.beginPath();
			ctx.moveTo(translatedPos.getX(), translatedPos.getY());
			translatedPos = this.getTranslatedPosition(lineSegment.endPoint);
			ctx.lineTo(translatedPos.getX(), translatedPos.getY());
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

	drawRasterRectangle(shape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;

		let translatedPos = this.getTranslatedPosition(shape.position);
		ctx.save();
		ctx.translate(translatedPos.getX(), translatedPos.getY());
		ctx.rotate(shape.rotationRadians);
		if (shape.opacity < 1) {
			ctx.globalAlpha = shape.opacity;
		}
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

		this.setShapeStyle(shape.style, ctx);
		if (shape.style.isFillVisible())
			ctx.fillText(shape.text, 0, 0);
		if (shape.style.isPenVisible())
			ctx.strokeText(shape.text, 0, 0);

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

	setShapeStyle(shapeStyle, ctx) {
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
		else
			ctx.strokeStyle = penGradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2);
		ctx.lineWidth = shapeStyle.getPenWidth();
		const lineCap = shapeStyle.getLineCap();
		ctx.lineCap = LineCap.getNameFor(lineCap);
		ctx.lineJoin = LineJoinStyle.getNameFor(shapeStyle.getLineJoinStyle());
		const gradient = shapeStyle.getFillGradient();
		if (gradient === undefined) {
			if (shapeStyle.getFillColor() !== Transparent) {
				const fillColor = shapeStyle.getFillColor();
				if (fillColor instanceof AlphaColour)
					ctx.fillStyle = AlphaColour.getRGBAExpression(fillColor);
				else
					ctx.fillStyle = fillColor.to6DigitHTMLCode();
			}
		}
		else {
			ctx.fillStyle = gradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2);
		}
	}
}