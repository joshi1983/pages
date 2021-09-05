import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../../modules/Colour.js';
import { EllipseShape } from '../../../../modules/drawing/vector/shapes/EllipseShape.js';
import { getSimplestShape } from '../../../../modules/drawing/vector/drawing_optimization/getSimplestShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testCirclesRemainCircles(logger) {
	const result2 = getSimplestShape(new CircleShape(new Vector3D(), 10));
	if (!(result2 instanceof CircleShape))
		logger('Expected an instance of CircleShape when input was a CircleShape.  result2 = ' + result2);
}

function testFullCircleArcsSimplifyToCircles(logger) {
	const arc = new ArcShape(new Vector3D(), 0, 100, 7);
	const result1 = getSimplestShape(arc);
	if (!(result1 instanceof CircleShape))
		logger('Expected an instance of CircleShape but did not get one.  result1 = ' + result1);
}

function testEllipsesWithEqualRadiiSimplifyToCircles(logger) {
	const style = new ShapeStyle();
	style.setFillColor(new Colour('#f00'));
	const ellipse = new EllipseShape(new Vector3D(1, 2, 3), 1, 5, 5, style);
	const result = getSimplestShape(ellipse);
	if (!(result instanceof CircleShape))
		logger('Expected a CircleShape but got ' + result);
	else if (!result.position.equals(new Vector3D(1, 2 , 3)))
		logger('Expected centre to be 1, 2, 3 but got ' + result.position);
	else if (!result.style.equals(style))
		logger('Expected style of CircleShape to be ' + style + ' but got ' + result.style);
}

export function testGetSimplestShape(logger) {
	testCirclesRemainCircles(prefixWrapper('testCirclesRemainCircles', logger));
	testEllipsesWithEqualRadiiSimplifyToCircles(prefixWrapper('testEllipsesWithEqualRadiiSimplifyToCircles', logger));
	testFullCircleArcsSimplifyToCircles(prefixWrapper('testFullCircleArcsSimplifyToCircles', logger));
};