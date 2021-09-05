import { clampRadianAngle } from '../clampRadianAngle.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { gradientSpreadMethod } from '../parsing/parse-tree-analysis/string-formats/gradientSpreadMethod.js';
import { MathCommands } from './MathCommands.js';
import { StringBuffer } from '../StringBuffer.js';
import { Transparent } from '../Transparent.js';
import { TurtleDrawState } from '../drawing/TurtleDrawState.js';
import { valueToString } from '../valueToString.js';
import { Vector3D } from '../drawing/vector/Vector3D.js';
import { VectorDrawing } from '../drawing/vector/VectorDrawing.js';

export class Turtle extends EventDispatcher {
	constructor(settings, drawing) {
		if (typeof settings !== 'object')
			throw new Error('settings must be an object');
		if (typeof drawing !== 'object')
			throw new Error('drawing must be an object');
		if (!(drawing instanceof VectorDrawing))
			throw new Error('drawing must be a VectorDrawing');

		super(['addForegroundShape', 'change', 'clearScreen', 'setScreenColor']);
		this.settings = settings;
		this.drawing = drawing;
		this.drawState = new TurtleDrawState();
		this._printBuffer = new StringBuffer();
		const outer = this;
		drawing.addEventListener('addForegroundShape,change,clearScreen,setScreenColor', function(e) {
			outer._dispatchEvent(e.key, e.details);
		});
	}

	_warn(msg) {
		if (typeof this.settings.warn === 'function')
			this.settings.warn(msg);
	}

	_error(msg) {
		if (typeof this.settings.error === 'function')
			this.settings.error(msg);
	}

	arc(angleDegrees, radius) {
		const shape = this.drawState.arc(radius, angleDegrees * MathCommands.degToRadianScale);
		if (shape.isVisible())
			this.drawing.addForegroundShape(shape);
	}

	arcLeft(angleDegrees, radius) {
		const shape = this.drawState.arcLeft(radius, angleDegrees * MathCommands.degToRadianScale);
		if (this.drawState.isPenDown && shape.style.isPenVisible() && shape.isVisible())
			this.drawing.addForegroundShape(shape);
	}

	arcRight(angleDegrees, radius) {
		const shape = this.drawState.arc2(radius, angleDegrees * MathCommands.degToRadianScale);
		if (this.drawState.isPenDown && shape.style.isPenVisible() && shape.isVisible())
			this.drawing.addForegroundShape(shape);
	}

	backward(distance) {
		this.forward(-distance);
	}

	circle(radius) {
		this.drawing.addForegroundShape(this.drawState.circle(radius));
	}

	circle2(radius) {
		this.drawing.addForegroundShape(this.drawState.circle2(radius));
	}

	clearScreen() {
		this.home();
		this.setHeading(0);
		this.drawing.clearScreen();
	}

	closePath() {
		this.drawing.closePath();
	}

	createLinearGradient(p1, p2, colorStops, spreadMethod) {
		const msg = gradientSpreadMethod(spreadMethod);
		if (msg === undefined)
			return TurtleDrawState.createLinearGradient(p1, p2, colorStops, spreadMethod);
		else
			throw new Error(msg);
	}

	createRadialGradient(outerCentre, focus, radius, colorStops, spreadMethod) {
		const msg = gradientSpreadMethod(spreadMethod);
		if (msg === undefined)
			return TurtleDrawState.createRadialGradient(outerCentre, focus, radius, colorStops, spreadMethod);
		else
			throw new Error(msg);
	}

	distance(point) {
		return new MathCommands().hypot(this.drawState.getPosition().minus(point));
	}

	ellipse(radius1, radius2) {
		this.drawing.addForegroundShape(this.drawState.ellipse(radius1, radius2));
	}

	ellipse2(radius1, radius2) {
		this.drawing.addForegroundShape(this.drawState.ellipse2(radius1, radius2));
	}

	ellipseArc(angle, radius1, radius2, startAngle) {
		this.drawing.addForegroundShape(this.drawState.ellipseArc(
			angle * MathCommands.degToRadianScale, radius1, radius2, startAngle * MathCommands.degToRadianScale));
	}

	ellipseArc2(angleDegrees, radius1, radius2, startAngle) {
		const shape = this.drawState.ellipseArc2(angleDegrees * MathCommands.degToRadianScale, radius1, radius2,
			startAngle * MathCommands.degToRadianScale);
		if (this.drawState.isPenDown && shape.style.isPenVisible() && shape.isVisible())
			this.drawing.addForegroundShape(shape);
	}

	fillColor() {
		const result = this.drawState.getFillColor();
		if (result === Transparent)
			return result;
		else
			return result.toArray();
	}

	fillGradient() {
		const result = this.drawState.getFillGradient();
		if (result === undefined)
			return null;
		else
			return result;
	}

	fontFamily() {
		return this.drawState.getFontFamily();
	}

	fontSize() {
		return this.drawState.getFontSize();
	}

	forward(distance) {
		const shape = this.drawState.forward(distance);
		if (shape !== undefined && this.drawState.isPenDown && shape.style.isPenVisible())
			this.drawing.addForegroundShape(shape);
	}

	heading() {
		return this.drawState.getHeading() / MathCommands.degToRadianScale;
	}

	hideTurtle() {
		this.drawState.hideTurtle();
	}

	home() {
		this.setXY(0, 0);
	}

	image(width, height, url) {
		const shape = this.drawState.image(width, height, url);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			if (this.settings.redrawNeeded !== undefined)
				shape.addEventListener('load', this.settings.redrawNeeded);
		}
	}

	jumpLeft(distance) {
		this.drawState.jumpRight(-distance);
	}

	jumpRight(distance) {
		this.drawState.jumpRight(distance);
	}

	label(text) {
		const shape = this.drawState.label(text);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
		}
	}

	left(angleDegrees) {
		this.right(-angleDegrees);
	}

	penColor() {
		const penColor = this.drawState.getPenColor();
		if (penColor === Transparent)
			return penColor;
		else
			return penColor.toArray();
	}

	penDown() {
		this.drawState.penDown();
	}

	penDownp() {
		return this.drawState.isPenDown;
	}

	penGradient() {
		const result = this.drawState.getPenGradient();
		if (result === undefined)
			return null;
		else
			return result;
	}

	penNormal() {
		this.drawState.penNormal();
	}

	penSize() {
		return this.drawState.getPenWidth();
	}

	penUp() {
		this.drawState.penUp();
	}

	pitch() {
		return this.drawState.getPitch() / MathCommands.degToRadianScale;
	}

	polyEnd() {
		this.drawing.addForegroundShape(this.drawState.getPolyShape());
		this.drawState.polyEnd();
	}

	polyStart() {
		this.drawState.polyStart();
	}

	pos() {
		return this.drawState.getPosition().toArray();
	}

	print(value) {
		if (typeof this.settings.print === 'function') {
			this.settings.print(this._printBuffer.toString() + valueToString(value));
			this._printBuffer.clear();
		}
	}

	right(angleDegrees) {
		this.setHeading(this.heading() + angleDegrees);
	}

	roll() {
		return this.drawState.getRoll() / MathCommands.degToRadianScale;
	}

	screenColor() {
		return this.drawing.getScreenColor();
	}

	setColors(c) {
		this.drawState.setFillColor(c);
		this.drawState.setPenColor(c);
	}

	setFillColor(c) {
		this.drawState.setFillColor(c);
	}

	setFillGradient(gradient) {
		this.drawState.setFillGradient(gradient);
	}

	setFontFamily(newFamilyName) {
		this.drawState.setFontFamily(newFamilyName);
	}

	setFontSize(newSize) {
		this.drawState.setFontSize(newSize);
	}

	setHeading(newHeadingDegrees) {
		this.drawState.setHeading(newHeadingDegrees * MathCommands.degToRadianScale);
	}

	setLineJoinStyle(newLineJoinStyle) {
		this.drawState.setLineJoinStyle(newLineJoinStyle);
	}

	setPenColor(c) {
		this.drawState.setPenColor(c);
	}

	setPenGradient(gradient) {
		this.drawState.setPenGradient(gradient);
	}

	setPenSize(w) {
		if (typeof w !== 'number' || isNaN(w))
			w = 1;
		w = Math.abs(w);
		this.drawState.setPenWidth(w);
	}

	setPitch(newPitchDegrees) {
		this.drawState.setPitch(newPitchDegrees * MathCommands.degToRadianScale);
	}

	setPos(p) {
		if (this.drawState.isPenDown === true) {
			const shape = this.drawState.setPositionAndGetLine(new Vector3D(p));
			if (shape.style.isPenVisible())
				this.drawing.addForegroundShape(shape);
		}
		else
			this.drawState.setPosition(new Vector3D(p));
	}

	setRoll(newRollDegrees) {
		this.drawState.setRoll(newRollDegrees * MathCommands.degToRadianScale);
	}

	setScreenColor(c) {
		this.drawing.setScreenColor(c);
	}

	setX(x) {
		this.setPos(new Vector3D(x, this.drawState.getY(), this.drawState.getZ()));
	}

	setXY(x, y) {
		this.setPos(new Vector3D(x, y, this.drawState.getZ()));
	}

	setXYZ(x, y, z) {
		this.setPos(new Vector3D(x, y, z));
	}

	setY(y) {
		this.setPos(new Vector3D(this.drawState.getX(), y, this.drawState.getZ()));
	}

	setZ(z) {
		this.setPos(new Vector3D(this.drawState.getX(), this.drawState.getY(), z));
	}

	shownp() {
		return this.drawState.isTurtleVisible;
	}

	showTurtle() {
		this.drawState.showTurtle();
	}

	sphere(radius) {
		const shape = this.drawState.sphere(radius);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
		}
	}

	towards(otherPoint) {
		otherPoint = new Vector3D(otherPoint).minus(this.drawState.position);
		return clampRadianAngle(Math.atan2(otherPoint.getX(), otherPoint.getY())) / MathCommands.degToRadianScale;
	}

	type(value) {
		if (typeof this.settings.print === 'function')
			this._printBuffer.append(valueToString(value));
	}

	xCor() {
		return this.drawState.getX();
	}

	xyCor() {
		return [this.drawState.getX(), this.drawState.getY()];
	}

	yCor() {
		return this.drawState.getY();
	}

	zCor() {
		return this.drawState.getZ();
	}
};