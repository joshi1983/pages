import { ArcShape } from '../../modules/drawing/vector/shapes/ArcShape.js';
import { isCloseEnough } from '../helpers/isCloseEnough.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

function processArcTestCase(caseInfo, index, logger, methodName) {
	const tds = new TurtleDrawState();
	const plogger = prefixWrapper('Case ' + index + ' with inputs, ' + JSON.stringify(caseInfo.in), logger);
	const shape = tds[methodName](...caseInfo.in);
	if ((shape instanceof ArcShape) === caseInfo.isCircle)
		plogger('arc2 expected to return an ArcShape of ' + (!caseInfo.isCircle) + ' but got something different');
	else {
		if (shape.radius !== caseInfo.in[0])
			plogger('arc radius expected to be ' + caseInfo.in[0] + ' but got ' + shape.radius);
		if (!isCloseEnough(shape.position.getX(), caseInfo.returnValue.position[0]))
			plogger('arc position x expected to be ' + caseInfo.returnValue.position[0] + ' but got ' + shape.position.getX());
		if (!isCloseEnough(shape.position.getY(), caseInfo.returnValue.position[1]))
			plogger('arc position y expected to be ' + caseInfo.returnValue.position[1] + ' but got ' + shape.position.getY());
		if (shape.position.getZ() !== caseInfo.returnValue.position[2])
			plogger('arc position z expected to be ' + caseInfo.returnValue.position[2] + ' but got ' + shape.position.getZ());
	}
	if (!isCloseEnough(tds.getX(), caseInfo.newPosition[0]))
		plogger(methodName + ' should leave tds position x expected at ' + caseInfo.newPosition[0] + ' but got ' + tds.getX());
	if (!isCloseEnough(tds.getY(), caseInfo.newPosition[1]))
		plogger(methodName + ' should leave tds position y expected at ' + caseInfo.newPosition[1] + ' but got ' + tds.getY());
	if (!isCloseEnough(tds.getZ(), caseInfo.newPosition[2]))
		plogger(methodName + ' should leave tds position z expected at ' + caseInfo.newPosition[2] + ' but got ' + tds.getZ());
	if (!isCloseEnough(tds.getHeading(), caseInfo.newHeading))
		plogger('New heading expected to be ' + caseInfo.newHeading + ' but got ' + tds.getHeading());
}

function testArc2(logger) {
	const cases = [
	{
		'in': [10, Math.PI],
		'returnValue': {
			'isCircle': false,
			'position': [10, 0, 0],
		},
		'newPosition': [20, 0, 0],
		'newHeading': Math.PI
	},
	{
		'in': [10, Math.PI * 0.5],
		'returnValue': {
			'isCircle': false,
			'position': [10, 0, 0],
		},
		'newPosition': [10, 10, 0],
		'newHeading': Math.PI * 0.5
	},
	{
		'in': [10, 0],
		'returnValue': {
			'isCircle': false,
			'position': [10, 0, 0],
		},
		'newPosition': [0, 0, 0],
		'newHeading': 0
	},
	{
		'in': [10, Math.PI * 0.25],
		'returnValue': {
			'isCircle': false,
			'position': [10, 0, 0],
		},
		'newPosition': [2.928932188, 7.07106781, 0],
		'newHeading': Math.PI * 0.25
	},
	{
		'in': [10, Math.PI * 2],
		'returnValue': {
			'isCircle': true,
			'position': [10, 0, 0],
		},
		'newPosition': [0, 0, 0],
		'newHeading': 0
	}
	];
	cases.forEach(function(caseInfo, index) {
		processArcTestCase(caseInfo, index, logger, 'arc2');
	});
}

function testArc(logger) {
	const tds = new TurtleDrawState();
	const radius = 10;
	const shape = tds.arc(radius, Math.PI);
	if (!(shape instanceof ArcShape))
		logger('arc expected to return an ArcShape but it did not');
	else {
		if (shape.radius !== radius)
			logger('arc radius expected to be ' + radius + ' but got ' + shape.radius);
		if (shape.position.getX() !== 0)
			logger('arc position x expected to be 0 but got ' + shape.position.getX());
		if (shape.position.getY() !== 0)
			logger('arc position y expected to be 0 but got ' + shape.position.getY());
		if (shape.position.getZ() !== 0)
			logger('arc position z expected to be 0 but got ' + shape.position.getZ());
	}
	if (tds.getX() !== 0)
		logger('tds.getX() expected to return 0 but got ' + tds.getX());
	if (tds.getY() !== 0)
		logger('tds.getY() expected to return 0 but got ' + tds.getY());
	if (tds.getZ() !== 0)
		logger('tds.getZ() expected to return 0 but got ' + tds.getZ());
}

function testArcLeft(logger) {
	const cases = [
	{
		'in': [10, 0],
		'returnValue': {
			'isCircle': false,
			'position': [10, 0, 0],
		},
		'newPosition': [0, 0, 0],
		'newHeading': 0
	},
	{
		'in': [10, 0.000000001],
		'returnValue': {
			'isCircle': false,
			'position': [-10, 0, 0],
		},
		'newPosition': [0, 0, 0],
		'newHeading': Math.PI * 2 - 0.000000001
	},
	{
		'in': [10, Math.PI],
		'returnValue': {
			'isCircle': false,
			'position': [-10, 0, 0],
		},
		'newPosition': [-20, 0, 0],
		'newHeading': Math.PI
	},
	];
	cases.forEach(function(caseInfo, index) {
		processArcTestCase(caseInfo, index, logger, 'arcLeft');
	});
}

export function testTurtleDrawStateArcs(logger) {
	wrapAndCall([
		testArc,
		testArc2,
		testArcLeft
	], logger);
};