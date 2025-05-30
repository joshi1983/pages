import { animationImage } from './helpers/drawing/animationImage.js';
import { animationImageAlpha } from './helpers/drawing/animationImageAlpha.js';
import { arcLines } from './helpers/drawing/arcLines.js';
import { arcPair } from './helpers/drawing/arcPair.js';
import { arcsLeft } from './helpers/drawing/arcsLeft.js';
import { arcsRight } from './helpers/drawing/arcsRight.js';
import { arrow } from './helpers/drawing/arrow.js';
import { blendModeToCommandReturnValue } from './helpers/blendModeToCommandReturnValue.js';
import { circlePair } from './helpers/drawing/circlePair.js';
import { clamp } from '../clamp.js';
import { clampRadianAngle } from '../clampRadianAngle.js';
import { colorToCommandReturnValue } from './helpers/colorToCommandReturnValue.js';
import { distanceToCircle } from './helpers/distanceToCircle.js';
import { distanceToLine } from './helpers/distanceToLine.js';
import { drawArcLineShape } from './helpers/drawing/drawArcLineShape.js';
import { drawArcLineShapes } from './helpers/drawing/drawArcLineShapes.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { FontWeight } from '../drawing/vector/shapes/style/FontWeight.js';
import { getArcLeftAngleToCircle } from './helpers/getArcLeftAngleToCircle.js';
import { getArcLeftAngleToLine } from './helpers/getArcLeftAngleToLine.js';
import { getArcRightAngleToCircle } from './helpers/getArcRightAngleToCircle.js';
import { getArcRightAngleToLine } from './helpers/getArcRightAngleToLine.js';
import { getSimplestShape } from '../drawing/vector/drawing_optimization/getSimplestShape.js';
import { isotoxalStar } from './helpers/drawing/isotoxalStar.js';
import { isoTrapezoid } from './helpers/drawing/isoTrapezoid.js';
import { isoTriangle } from './helpers/drawing/isoTriangle.js';
import { LineCap } from '../drawing/vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../drawing/vector/shapes/style/LineJoinStyle.js';
import { MathCommands } from './MathCommands.js';
import { MixBlendMode } from '../drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';
import { parallelogram } from './helpers/drawing/parallelogram.js';
import { preventPathJoin } from './helpers/drawing/preventPathJoin.js';
import { processSettings } from './helpers/processSettings.js';
import { rect } from './helpers/drawing/rect.js';
import { regularPolygon } from './helpers/drawing/regularPolygon.js';
import { regularStar } from './helpers/drawing/regularStar.js';
import { roundIsoStar } from './helpers/drawing/roundIsoStar.js';
import { roundIsoTriangle } from './helpers/drawing/roundIsoTriangle.js';
import { roundRect } from './helpers/drawing/roundRect.js';
import { roundRegularPolygon } from './helpers/drawing/roundRegularPolygon.js';
import { roundRegularStar } from './helpers/drawing/roundRegularStar.js';
import { StringBuffer } from '../StringBuffer.js';
import { stripes } from './helpers/drawing/stripes.js';
import { TurtleDrawState } from '../drawing/TurtleDrawState.js';
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
		processSettings(this);
	}

	async animation_image(width, height, url, timeRatio) {
		const shape = await animationImage(this, width, height, url, timeRatio);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			if (this.settings.redrawNeeded !== undefined)
				shape.addEventListener('load', this.settings.redrawNeeded);
		}
	}

	async animation_imageAlpha(width, height, url, alphaRatio, timeRatio) {
		const shape = await animationImageAlpha(this, width, height, url, alphaRatio, timeRatio);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			if (this.settings.redrawNeeded !== undefined)
				shape.addEventListener('load', this.settings.redrawNeeded);
		}
	}

	arc(angleDegrees, radius) {
		const shape = this.drawState.arc(radius, angleDegrees * MathCommands.degToRadianScale);
		if (shape.isVisible())
			this.drawing.addForegroundShape(shape);
	}

	arcLeft(angleDegrees, radius) {
		const shape = this.drawState.arcLeft(radius, angleDegrees * MathCommands.degToRadianScale);
		if (this.drawState.isPenDown && shape.style.isPenVisible() && shape.isVisible())
			this.drawing.addForegroundShape(shape, true);
	}

	arcLines(arcLinesInfo, scale) {
		arcLines(this, arcLinesInfo, scale);
	}

	arcPair(length, arcAngle) {
		arcPair(this, length, arcAngle);
	}

	arcRight(angleDegrees, radius) {
		const shape = this.drawState.arc2(radius, angleDegrees * MathCommands.degToRadianScale);
		if (this.drawState.isPenDown && shape.style.isPenVisible() && shape.isVisible())
			this.drawing.addForegroundShape(shape, true);
	}

	arcsLeft(arcsInfo, scale) {
		arcsLeft(this, arcsInfo, scale);
	}

	arcsRight(arcsInfo, scale) {
		arcsRight(this, arcsInfo, scale);
	}

	arrow(length, headAngleDegrees, edgeSize) {
		arrow(this, length, headAngleDegrees, edgeSize);
	}

	assert(condition) {
		if (!condition)
			throw new Error('Assertion failed');
	}

	backward(distance) {
		this.forward(-distance);
	}

	circle(radius) {
		this.drawing.addForegroundShape(this.drawState.circle(radius));
	}

	circleLeft(radius) {
		this.drawing.addForegroundShape(this.drawState.circleLeft(radius));
	}

	circlePair(startRadius, endRadius, separation) {
		circlePair(this, startRadius, endRadius, separation);
	}

	circleRight(radius) {
		this.drawing.addForegroundShape(this.drawState.circleRight(radius));
	}

	clearScreen() {
		this.home();
		this.setHeading(0);
		this.drawing.clearScreen();
	}

	closePath() {
		this.drawing.closePath();
	}

	distance(point) {
		if (point.length === 2)
			point = [point[0], point[1], this.zCor()];
		return new MathCommands().hypot(this.drawState.getPosition().minus(point));
	}

	distanceToCircle(center, radius) {
		return distanceToCircle(this, center, radius);
	}

	distanceToLine(point1, point2) {
		return distanceToLine(this, point1, point2);
	}

	drawArcLineShape(shape, scale) {
		drawArcLineShape(this, shape, scale);
	}

	drawArcLineShapes(shapes, scale) {
		drawArcLineShapes(this, shapes, scale);
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

	fillBlendMode() {
		return blendModeToCommandReturnValue(this.drawState.style.getFillBlendMode());
	}

	fillColor() {
		return colorToCommandReturnValue(this.drawState.getFillColor());
	}

	fillGradient() {
		const result = this.drawState.getFillGradient();
		if (result === undefined)
			return null;
		else
			return result;
	}

	fillGradientp() {
		return undefined !== this.drawState.getFillGradient();
	}

	fontFamily() {
		return this.drawState.getFontFamily();
	}

	fontSize() {
		return this.drawState.getFontSize();
	}

	fontWeight() {
		return FontWeight.getNameFor(this.drawState.getFontWeight());
	}

	forward(distance) {
		const shape = this.drawState.forward(distance);
		if (shape !== undefined && this.drawState.isPenDown && shape.style.isPenVisible())
			this.drawing.addForegroundShape(shape);
	}

	getArcLeftAngleToCircle(arcRadius, circlePosition, circleRadius) {
		return getArcLeftAngleToCircle(this, arcRadius, circlePosition, circleRadius);
	}

	getArcLeftAngleToLine(arcRadius, linePoint1, linePoint2) {
		const drawState = this.drawState;
		return getArcLeftAngleToLine(drawState.orientation.getHeadingRadians(),
			drawState.position.coords, arcRadius, linePoint1, linePoint2);
	}

	getArcRightAngleToCircle(arcRadius, circlePosition, circleRadius) {
		return getArcRightAngleToCircle(this, arcRadius, circlePosition, circleRadius);
	}

	getArcRightAngleToLine(arcRadius, linePoint1, linePoint2) {
		const drawState = this.drawState;
		return getArcRightAngleToLine(drawState.orientation.getHeadingRadians(),
			drawState.position.coords, arcRadius, linePoint1, linePoint2);
	}

	heading() {
		return this.drawState.getHeading() / MathCommands.degToRadianScale;
	}

	hideTurtle() {
		this.drawState.hideTurtle();
	}

	home() {
		this.setXY(0, 0);
		this.drawState.orientation.reset();
	}

	image(width, height, url) {
		const shape = this.drawState.image(width, height, url);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			if (this.settings.redrawNeeded !== undefined)
				shape.addEventListener('load', this.settings.redrawNeeded);
		}
	}

	imageAlpha(width, height, url, opacity) {
		opacity = clamp(opacity, 0, 1);
		const shape = this.drawState.imageAlpha(
			width, height, url, opacity);
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			if (this.settings.redrawNeeded !== undefined)
				shape.addEventListener('load', this.settings.redrawNeeded);
		}
	}

	isotoxalStar(radius1, radius2, numPoints) {
		isotoxalStar(this, radius1, radius2, numPoints);
	}

	isoTrapezoid(startWidth, endWidth, height) {
		isoTrapezoid(this, startWidth, endWidth, height);
	}

	isoTriangle(width, height) {
		isoTriangle(this, width, height);
	}

	jumpBackward(distance) {
		this.drawState.jumpForward(-distance);
	}

	jumpForward(distance) {
		this.drawState.jumpForward(distance);
	}

	jumpIn(distance) {
		this.drawState.jumpIn(distance);
	}

	jumpLeft(distance) {
		this.drawState.jumpRight(-distance);
	}

	jumpOut(distance) {
		this.drawState.jumpIn(-distance);
	}

	jumpRight(distance) {
		this.drawState.jumpRight(distance);
	}

	jumpTo(newPosition) {
		if (newPosition.length === 3)
			newPosition = new Vector3D(newPosition);
		else if (newPosition.length === 2)
			newPosition = new Vector3D(newPosition[0], newPosition[1], this.drawState.getZ());
		else if (newPosition.length === 1)
			newPosition = new Vector3D(newPosition[0], this.drawState.getY(), this.drawState.getZ());
		else
			throw new Error(`Invalid list length/count ${newPosition.length}.  2 or 3 required`);
		this.drawState.setPosition(newPosition);
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

	lineCap() {
		return LineCap.getNameFor(this.drawState.getLineCap());
	}

	lineJoinStyle() {
		return LineJoinStyle.getNameFor(this.drawState.getLineJoinStyle());
	}

	miterLimit() {
		return this.drawState.getMiterLimit();
	}

	orientation() {
		return this.drawState.getOrientation();
	}

	parallelogram(width, slantedHeight, angleDegrees) {
		parallelogram(this, width, slantedHeight, angleDegrees);
	}

	penBlendMode() {
		return blendModeToCommandReturnValue(this.drawState.style.getPenBlendMode());
	}

	penColor() {
		return colorToCommandReturnValue(this.drawState.getPenColor());
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

	penGradientp() {
		return undefined !== this.drawState.getPenGradient();
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

	pitchDown(angleDegrees) {
		this.pitchUp(-angleDegrees);
	}

	pitchUp(angleDegrees) {
		this.drawState.pitchUp(angleDegrees * MathCommands.degToRadianScale);
	}

	polyEnd() {
		const shape = getSimplestShape(this.drawState.getPolyShape());
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
			this.drawing.optimizeTopShapes();
		}
		this.drawState.polyEnd();
	}

	polygon(points) {
		const shape = getSimplestShape(this.drawState.getPolygon(points));
		if (shape.isVisible()) {
			this.drawing.addForegroundShape(shape);
		}
	}

	polyStart() {
		this.drawState.polyStart();
	}

	pos() {
		return this.drawState.getPosition().toArray();
	}

	preventPathJoin() {
		preventPathJoin(this.drawing);
	}

	rect(width, height) {
		rect(this, width, height);
	}

	regularPolygon(radius, numSides) {
		regularPolygon(this, radius, numSides);
	}

	regularStar(radius, numPoints) {
		regularStar(this, radius, numPoints);
	}

	right(angleDegrees) {
		this.setHeading(this.heading() + angleDegrees);
	}

	roll() {
		return this.drawState.getRoll() / MathCommands.degToRadianScale;
	}

	rollLeft(angleDegrees) {
		this.rollRight(-angleDegrees);
	}

	rollRight(angleDegrees) {
		this.drawState.rollRight(angleDegrees * MathCommands.degToRadianScale);
	}

	roundIsoStar(radius1, radius2, numPoints, cornerRadius1, cornerRadius2) {
		roundIsoStar(this, radius1, radius2, numPoints, cornerRadius1, cornerRadius2);
	}

	roundIsoTriangle(baseWidth, height, cornerRadius) {
		roundIsoTriangle(this, baseWidth, height, cornerRadius);
	}

	roundRect(width, height, cornerRadius) {
		roundRect(this, width, height, cornerRadius);
	}

	roundRegularPolygon(radius, numSides, cornerRadius) {
		roundRegularPolygon(this, radius, numSides, cornerRadius);
	}

	roundRegularStar(radius, numPoints, cornerRadius1, cornerRadius2) {
		roundRegularStar(this, radius, numPoints, cornerRadius1, cornerRadius2);
	}

	screenColor() {
		return colorToCommandReturnValue(this.drawing.getScreenColor());
	}

	setColors(c) {
		this.drawState.setFillColor(c);
		this.drawState.setPenColor(c);
	}

	setFillBlendMode(newBlendMode) {
		newBlendMode = MixBlendMode.parse(newBlendMode);
		this.drawState.style.setFillBlendMode(newBlendMode);
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

	setFontWeight(newFontWeight) {
		if (!Number.isInteger(newFontWeight))
			throw new Error('newFontWeight must be integer.  Not: ' + newFontWeight);
		this.drawState.setFontWeight(newFontWeight);
	}

	setHeading(newHeadingDegrees) {
		this.drawState.setHeading(newHeadingDegrees * MathCommands.degToRadianScale);
	}

	setLineCap(newLineCap) {
		if (!Number.isInteger(newLineCap))
			throw new Error('newLineCap must be integer.  Not: ' + newLineCap);
		this.drawState.setLineCap(newLineCap);
	}

	setLineJoinStyle(newLineJoinStyle) {
		this.drawState.setLineJoinStyle(newLineJoinStyle);
	}

	setMiterLimit(newLimit) {
		this.drawState.setMiterLimit(newLimit);
	}

	setOrientation(orientation) {
		this.drawState.setOrientation(orientation);
	}

	setPenBlendMode(newBlendMode) {
		newBlendMode = MixBlendMode.parse(newBlendMode);
		this.drawState.style.setPenBlendMode(newBlendMode);
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
		this.drawState.setPenWidth(Math.abs(w));
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

	setTurtleState(newState) {
		this.drawState.setTurtleState(newState);
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

	stripes(width, height, colors) {
		stripes(this, width, height, colors);
	}

	towards(otherPoint) {
		otherPoint = new Vector3D(otherPoint).minus(this.drawState.position);
		return clampRadianAngle(Math.atan2(otherPoint.getX(), otherPoint.getY())) / MathCommands.degToRadianScale;
	}

	turtleState() {
		return this.drawState.getTurtleState();
	}

	turtleVisiblep() {
		return this.drawState.isTurtleVisible;
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