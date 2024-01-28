import { ArcShape } from './vector/shapes/ArcShape.js';
import { CircleShape } from './vector/shapes/CircleShape.js';
import { Colour } from '../Colour.js';
import { EllipseShape } from './vector/shapes/EllipseShape.js';
import { EllipseArcShape } from './vector/shapes/EllipseArcShape.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { getSimplestShape } from './vector/drawing_optimization/getSimplestShape.js';
import { getSimplestShapeStyle } from './vector/drawing_optimization/getSimplestShapeStyle.js';
import { getTurtleStateMap } from './turtle-draw-state/getTurtleStateMap.js';
import { isNumber } from '../isNumber.js';
import { LineCap } from './vector/shapes/style/LineCap.js';
import { LineJoinStyle } from './vector/shapes/style/LineJoinStyle.js';
import { LineSegmentShape } from './vector/shapes/LineSegmentShape.js';
import { optimizeClosedPath } from './vector/drawing_optimization/optimizeClosedPath.js';
import { Orientation } from './vector/Orientation.js';
import { Orientation2D } from './vector/Orientation2D.js';
import { PathShape } from './vector/shapes/PathShape.js';
import { RasterRectangleShape } from './vector/shapes/RasterRectangleShape.js';
import { sanitizeArcProperties } from './turtle-draw-state/sanitizeArcProperties.js';
import { setTurtleState } from './turtle-draw-state/setTurtleState.js';
import { ShapeStyle } from './vector/shapes/style/ShapeStyle.js';
import { SphereShape } from './vector/shapes/SphereShape.js';
import { TextShape } from './vector/shapes/TextShape.js';
import { Vector2D } from './vector/Vector2D.js';
import { Vector3D } from './vector/Vector3D.js';
await Colour.asyncInit();

const twoPi = Math.PI * 2;

/*
An instance of TurtleDrawState represents the complete state of a turtle except for 
*/
export class TurtleDrawState extends EventDispatcher {
	static HalfPi = Math.PI * 0.5;

	constructor() {
		super(['change']);
		this.reset();
	}

	_dispatchChange(propName) {
		super._dispatchEvent('change', {
			'name': propName
		});
	}

	_switchToOrientation3D() {
		this.orientation = new Orientation(0, 0, this.orientation.headingRadians);
	}

	arc(radius, angle) {
		const style = this.style.deepClone();
		style.clearFill();
		return getSimplestShape(new ArcShape(new Vector3D(this.position), this.orientation.headingRadians, radius, angle, style));
	}

	arc2(radius, angleRadians) {
		const returnCircle = (angleRadians >= twoPi || angleRadians <= -twoPi);
		if (returnCircle === true && angleRadians > twoPi)
			angleRadians = angleRadians % twoPi;
		const centreDisplacement = Vector3D.createFromPolar(-this.orientation.headingRadians, radius);
		const arcCentre = this.position.plus(centreDisplacement);
		const startAngle = this.orientation.headingRadians + TurtleDrawState.HalfPi;
		const displacement = Vector3D.createFromPolar(Math.PI - (this.orientation.headingRadians + angleRadians), radius);
		this.position = arcCentre.plus(displacement);
		this.orientation.setHeadingRadians((this.orientation.headingRadians + angleRadians) % (Math.PI * 2));
		const style = this.style.deepClone();
		style.clearFill();
		let arcShape;
		if (this.isInPolygon || returnCircle === false) {
			const sanitized = sanitizeArcProperties(startAngle, angleRadians);
			arcShape = new ArcShape(arcCentre, sanitized.startAngle, radius, sanitized.angle, style);
			if (this.isInPolygon)
				this.polyPoints.push(arcShape.deepClone());
		}
		if (returnCircle === true)
			return new CircleShape(arcCentre, radius, style);
		else {
			return arcShape;
		}
	}

	arcLeft(radius, angleRadians) {
		if (angleRadians <= 0)
			return this.arc2(radius, -angleRadians);
		const centreDisplacement = Vector3D.createFromPolar(- this.orientation.headingRadians, radius);
		const arcCentre = this.position.minus(centreDisplacement);
		const startAngle = -(-this.orientation.headingRadians + TurtleDrawState.HalfPi);
		const displacement = Vector3D.createFromPolar(-this.orientation.headingRadians + angleRadians, radius);
		this.position = arcCentre.plus(displacement);
		const returnCircle = (angleRadians > twoPi);
		if (returnCircle === true)
			angleRadians = angleRadians % twoPi;
		this.orientation.setHeadingRadians((this.orientation.headingRadians + Math.PI * 2 - angleRadians) % (2 * Math.PI));
		const style = this.style.deepClone();
		style.clearFill();
		let arcShape;
		if (this.isInPolygon || returnCircle === false) {
			const sanitized = sanitizeArcProperties(startAngle, -angleRadians);
			arcShape = new ArcShape(arcCentre, sanitized.startAngle, radius, sanitized.angle, style);
			if (this.isInPolygon)
				this.polyPoints.push(new ArcShape(arcCentre, startAngle, radius, -angleRadians, style));
		}
		if (returnCircle === true)
			return new CircleShape(arcCentre, radius, style);
		else
			return arcShape;
	}

	assign(otherDrawState) {
		if (!(otherDrawState instanceof TurtleDrawState))
			throw new Error('otherDrawState must be a TurtleDrawState');

		this.position.assign(otherDrawState.position);
		this.setHeading(otherDrawState.getHeading());
		this.style.assignFromShapeStyle(otherDrawState.style);
	}

	circle(radius) {
		return getSimplestShape(new CircleShape(new Vector3D(this.position), radius, this.style.deepClone()));
	}

	circleLeft(radius) {
		const centreDisplacement = Vector3D.createFromPolar(Math.PI - this.orientation.headingRadians, radius);
		const p = this.position.plus(centreDisplacement);
		return getSimplestShape(new CircleShape(p, radius, this.style.deepClone()));
	}

	circleRight(radius) {
		const centreDisplacement = Vector3D.createFromPolar(-this.orientation.headingRadians, radius);
		const p = this.position.plus(centreDisplacement);
		return getSimplestShape(new CircleShape(p, radius, this.style.deepClone()));
	}

	ellipse(radius1, radius2) {
		return getSimplestShape(new EllipseShape(new Vector3D(this.position),
			this.orientation.headingRadians, radius1, radius2, this.style.deepClone()));
	}

	ellipse2(radius1, radius2) {
		const centreDisplacement = Vector3D.createFromPolar(-this.orientation.headingRadians, radius2);
		const p = this.position.plus(centreDisplacement);
		return getSimplestShape(new EllipseShape(p,
			this.orientation.headingRadians,
			radius2, radius1,
			this.style.deepClone()));
	}

	ellipseArc(angle, radius1, radius2, startAngle) {
		const style = this.style.deepClone();
		style.clearFill();
		return getSimplestShape(new EllipseArcShape(new Vector3D(this.position),
			this.orientation.headingRadians,
			radius1, radius2, angle, startAngle, style));
	}

	// This is not accessible from a Logo program command.
	// ellipseArc2 is a work in progress.  It doesn't work correctly enough to be used by a Logo program.
	ellipseArc2(angle, radius1, radius2, startAngle) {
		const returnEllipse = (angle >= Math.PI * 2 || angle <= -Math.PI * 2);
		if (returnEllipse === true)
			angle = angle % (Math.PI * 2);
		const centreDisplacement = Vector3D.createFromPolar(-this.orientation.headingRadians, radius2);
		const arcCentre = this.position.plus(centreDisplacement);
		const displacement = Vector3D.createFromPolar(Math.PI - (this.orientation.headingRadians + angle), radius2);
		this.position = arcCentre.plus(displacement);
		const ellipseAngle = this.orientation.headingRadians - Math.PI / 2 + startAngle;
		startAngle = this.orientation.headingRadians + TurtleDrawState.HalfPi;
		this.orientation.setHeadingRadians((this.orientation.headingRadians + angle) % (Math.PI * 2));
		const style = this.style.deepClone();
		style.clearFill();
		let arcShape;
		if (this.isInPolygon || returnEllipse === false) {
			const sanitized = sanitizeArcProperties(startAngle, angle);
			sanitized.startAngle = Math.PI;
			arcShape = new EllipseArcShape(arcCentre, ellipseAngle,
				radius1, radius2, sanitized.angle, sanitized.startAngle, style);
			if (this.isInPolygon)
				this.polyPoints.push(arcShape.deepClone());
		}
		if (returnEllipse === true)
			return new EllipseShape(arcCentre, radius2, radius1, style);
		else {
			return arcShape;
		}
	}

	forward(distance) {
		if (distance === 0 && this.style.getLineCap() === LineCap.Butt)
			return; // nothing to do.  No shape to return.
		const endPoint = this.position.plus(this.orientation.rotate(new Vector3D(0, distance, 0)));
		const result = new LineSegmentShape(new Vector3D(this.position), endPoint, LineSegmentShape.sanitizeStyle(this.style.deepClone()));
		result.style = getSimplestShapeStyle(result, false);
		this.position.assign(endPoint);
		if (this.isInPolygon)
			this.polyPoints.push(new Vector3D(endPoint));
		this._dispatchChange('position');
		return result;
	}

	getFillColor() {
		return this.style.getFillColor();
	}

	getFillGradient() {
		return this.style.getFillGradient();
	}

	getFontFamily() {
		return this.style.getFontFamily();
	}

	getFontSize() {
		return this.style.getFontSize();
	}

	// Returns heading measured in radians
	getHeading() {
		return this.orientation.headingRadians;
	}

	getLineCap() {
		return this.style.getLineCap();
	}

	getLineJoinStyle() {
		return this.style.getLineJoinStyle();
	}

	getPenColor() {
		return this.style.getPenColor();
	}

	getPenGradient() {
		return this.style.getPenGradient();
	}

	getPenWidth() {
		return this.style.getPenWidth();
	}

	getPitch() {
		if (this.orientation.pitchRadians === undefined)
			return 0;
		return this.orientation.pitchRadians;
	}

	getPolyShape() {
		if (this.polyPoints.length < 2)
			throw new Error('There must be at least 2 path elements but got only ' + this.polyPoints.length);
		const result = new PathShape(this.polyPoints, true, this.style.deepClone());
		optimizeClosedPath(result);
		return result;
	}

	// Do not mutate the return value directly.
	// The Vector3D is returned and intended for reading only.
	getPosition() {
		return this.position;
	}

	getRoll() {
		if (this.orientation.rollRadians === undefined)
			return 0;
		return this.orientation.rollRadians;
	}

	getTurtleState() {
		return getTurtleStateMap(this);
	}

	getX() {
		return this.position.getX();
	}

	getY() {
		return this.position.getY();
	}

	getZ() {
		return this.position.getZ();
	}

	hasInitialOrientation() {
		return this.orientation.isInitial();
	}

	hideTurtle() {
		this.isTurtleVisible = false;
		this._dispatchChange('turtle-visible');
	}

	image(width, height, url) {
		return new RasterRectangleShape(new Vector3D(this.position), 
			width, height, this.orientation.headingRadians, url, 1, this.style.deepClone());
	}

	imageAlpha(width, height, url, opacity) {
		return new RasterRectangleShape(new Vector3D(this.position),
			width, height, this.orientation.headingRadians, url, opacity, this.style.deepClone());
	}

	jumpForward(distance) {
		const endPoint = this.position.plus(this.orientation.rotate(new Vector3D(0, distance, 0)));
		this.position.assign(endPoint);
		if (this.isInPolygon)
			this.polyPoints.push(new Vector3D(endPoint));
		this._dispatchChange('position');
	}

	jumpRight(distance) {
		const endPoint = this.position.plus(this.orientation.rotate(new Vector3D(distance, 0, 0)));
		this.position.assign(endPoint);
		if (this.isInPolygon)
			this.polyPoints.push(new Vector3D(endPoint));
		this._dispatchChange('position');
	}

	label(text) {
		return new TextShape(new Vector3D(this.position), this.orientation.headingRadians,
			text, this.style.deepClone());
	}

	penDown() {
		if (this.isPenDown === false) {
			this.isPenDown = true;
			this._dispatchChange('pen-contact');
		}
	}

	penNormal() {
		this.penDown();
		this.setPenWidth(1);
		this.setPenColor(new Colour('#000'));
	}

	penUp() {
		if (this.isPenDown === true) {
			this.isPenDown = false;
			this._dispatchChange('pen-contact');
		}
	}

	polyEnd() {
		this.isInPolygon = false;
		this.polyPoints = [];
	}

	polyStart() {
		if (this.isInPolygon === false) {
			this.isInPolygon = true;
		}
		this.polyPoints = [new Vector3D(this.position)];
	}

	reset() {
		this.orientation = new Orientation2D();
		this.isPenDown = true;
		this.isInPolygon = false;
		this.polyPoints = [];
		this.isTurtleVisible = true;
		this.position = new Vector3D();
		this.style = new ShapeStyle();
		this.style.clearFill();
		const outer = this;
		this.style.addEventListener('change', function(e) {
			outer._dispatchChange(e.name);
		});
		this._dispatchChange('reset');
	}

	right(angleDeltaRadians) {
		if (typeof angleDeltaRadians !== 'number' || isNaN(angleDeltaRadians))
			throw new Error('angleDeltaRadians must be a number');

		this.orientation.setHeadingRadians(this.orientation.headingRadians + angleDeltaRadians);
		this._dispatchChange('heading');
	}

	setFillColor(newColour) {
		this.style.setFillColor(newColour);
		this.style.setFillGradient(undefined);
	}

	setFillGradient(gradient) {
		this.style.setFillGradient(gradient);
	}

	setFontFamily(familyName) {
		this.style.setFontFamily(familyName);
	}

	setFontSize(newSize) {
		this.style.setFontSize(newSize);
	}

	// Sets heading in radians
	setHeading(newHeadingRadians) {
		if (isNumber(newHeadingRadians) === false)
			throw new Error('newHeadingRadians must be a number.  Not: ' + newHeadingRadians);
		this.orientation.setHeadingRadians(newHeadingRadians);
		this._dispatchChange('heading');
	}

	setLineCap(newLineCap) {
		this.style.setLineCap(newLineCap);
	}

	setLineJoinStyle(newLineJoinStyle) {
		this.style.setLineJoinStyle(LineJoinStyle.parse(newLineJoinStyle.toLowerCase()));
	}

	setPenColor(newColour) {
		this.style.setPenColor(newColour);
		this.style.setPenGradient(undefined);
	}

	setPenGradient(gradient) {
		this.style.setPenGradient(gradient);
	}

	setPenWidth(newPenWidth) {
		this.style.setPenWidth(newPenWidth);
	}

	setPitch(newPitchRadians) {
		if (!isNumber(newPitchRadians))
			throw new Error('newPitchRadians must be a number.  Not: ' + newPitchRadians);
		if (this.orientation instanceof Orientation2D) {
			if (newPitchRadians !== 0) {
				this._switchToOrientation3D();
				this.orientation.setPitchRadians(newPitchRadians);
			}
		}
		else
			this.orientation.setPitchRadians(newPitchRadians);
		this._dispatchChange('pitch');
	}

	setPosition(newPosition) {
		if (!(newPosition instanceof Vector3D))
			throw new Error('newPosition must be a Vector3D');

		this.position.assign(newPosition);
		this._dispatchChange('position');
	}

	setPositionAndGetLine(newPosition) {
		const result = new LineSegmentShape(new Vector3D(this.position),
			new Vector3D(newPosition), LineSegmentShape.sanitizeStyle(this.style.deepClone()));
		this.setPosition(newPosition);
		return result;
	}

	setRoll(newRollRadians) {
		if (!isNumber(newRollRadians))
			throw new Error('newRollRadians must be a number.  Not: ' + newRollRadians);
		if (this.orientation instanceof Orientation2D) {
			if (newRollRadians !== 0) {
				this._switchToOrientation3D();
				this.orientation.setRollRadians(newRollRadians);
			}
		}
		else
			this.orientation.setRollRadians(newRollRadians);
		this._dispatchChange('roll');
	}

	setTurtleState(newState) {
		setTurtleState(this, newState);
	}

	setX(x) {
		if (this.position.getX() !== x) {
			this.position.setX(x);
			this._dispatchChange('position-x');
		}
	}

	setY(y) {
		if (this.position.getY() !== y) {
			this.position.setY(y);
			this._dispatchChange('position-y');
		}
	}

	setZ(z) {
		if (this.position.getZ() !== z) {
			this.position.setZ(z);
			this._dispatchChange('position-z');
		}
	}

	showTurtle() {
		if (!this.isTurtleVisible) {
			this.isTurtleVisible = true;
			this._dispatchChange('turtle-visible');
		}
	}

	sphere(radius) {
		return new SphereShape(new Vector3D(this.position), radius, this.style.deepClone());
	}
};