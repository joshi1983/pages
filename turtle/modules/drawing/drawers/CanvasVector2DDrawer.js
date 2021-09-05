import { AbstractCanvasDrawer } from './AbstractCanvasDrawer.js';
import { Colour } from '../../Colour.js';
import { drawTurtle } from '../drawTurtle.js';
import { ellipseAngleChange } from './canvas/ellipseAngleChange.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { Transparent } from '../../Transparent.js';
import { Vector } from '../vector/Vector.js';
import { Vector2D } from '../vector/Vector2D.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';
import { Vector3D } from '../vector/Vector3D.js';

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
			Math.PI * 0.5 + arcShape.rotationRadians, Math.PI * 0.5 + arcShape.angle + arcShape.rotationRadians);
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
		if (circleShape.style.usesFill())
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
		if (ellipseShape.style.usesFill())
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
			ctx.closePath();
			ctx.stroke();
		}
	}

	drawPath(path, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		this.setShapeStyle(path.style, ctx);
		let translatedPos;
		ctx.beginPath();
		for (let i = 0; i < path.elements.length; i++) {
			const pathElement = path.elements[i];
			if (pathElement instanceof Vector) {
				translatedPos = this.getTranslatedPosition(pathElement);
				if (i === 0)
					ctx.moveTo(translatedPos.getX(), translatedPos.getY());
				else
					ctx.lineTo(translatedPos.getX(), translatedPos.getY());
			}
			else {
				const arc = pathElement;
				translatedPos = this.getTranslatedPosition(arc.position);
				if (i === 0) {
					const startPoint = this.getTranslatedPosition(arc.getStartPoint());
					ctx.moveTo(startPoint.getX(), startPoint.getY());
				}
				ctx.arc(translatedPos.getX(), translatedPos.getY(), arc.radius,
					Math.PI * 0.5 + arc.rotationRadians,
					Math.PI * 0.5 + arc.angle + arc.rotationRadians,
					arc.angle < 0
				);
			}
		}
		if (path.isClosed)
			ctx.closePath();
		if (path.style.usesFill())
			ctx.fill();
		if (path.style.isPenVisible())
			ctx.stroke();
		ctx.closePath();
	}

	drawRasterRectangle(shape, ctx) {
		if (ctx === undefined)
			ctx = this.foreground;
		
		let translatedPos = this.getTranslatedPosition(shape.position);
		ctx.save();
		ctx.translate(translatedPos.getX(), translatedPos.getY());
		ctx.rotate(shape.rotationRadians);

		ctx.drawImage(shape.image, -shape.width * 0.5, -shape.height, shape.width, shape.height);
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
		if (shape.style.usesFill())
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
		if (penGradient === undefined)
			ctx.strokeStyle = shapeStyle.getPenColor().to6DigitHTMLCode();
		else
			ctx.strokeStyle = penGradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2);
		ctx.lineWidth = shapeStyle.getPenWidth();
		const lineCap = shapeStyle.getLineCap();
		if (lineCap !== 'square')
			ctx.lineCap = lineCap;
		ctx.lineJoin = LineJoinStyle.getNameFor(shapeStyle.getLineJoinStyle());
		const gradient = shapeStyle.getFillGradient();
		if (gradient === undefined) {
			if (shapeStyle.getFillColor() !== Transparent)
				ctx.fillStyle = shapeStyle.getFillColor();
		}
		else {
			ctx.fillStyle = gradient.createFromCanvas2DContext(ctx, this.width / 2, this.height / 2);
		}
	}
}