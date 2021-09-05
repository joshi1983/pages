import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { createDrawingFromCode } from '../../../helpers/createDrawingFromCode.js';
import { getSimpleRectTestCases } from './getSimpleRectTestCases.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

const halfPi = Math.PI / 2;
const roundedRectProcedure = `to roundedRectangle :width :height :cornerRadius
	localmake "oldState turtleState
	localmake "width1 :width - :cornerRadius * 2
	localmake "height1 :height - :cornerRadius * 2
	jumpRight :cornerRadius
	right 90
	polyStart
	repeat 2 [
		forward :width1
		ArcLeft 90 :cornerRadius
		forward :height1
		ArcLeft 90 :cornerRadius
	]
	polyEnd
	setTurtleState :oldState
end
`;

function caseInfoToElements(caseInfo, style, logger) {
	if (typeof caseInfo.elementsInfo === 'object' &&
	caseInfo.elementsInfo.code !== undefined) {
		const elementsInfo = caseInfo.elementsInfo;
		const drawing = createDrawingFromCode(elementsInfo.code, logger);
		const shapes = drawing.getShapesArray();
		const paths = shapes.filter(s => s instanceof PathShape);
		if (paths.length === 0)
			throw new Error(`Expected to find a PathShape but did not in array of ${shapes.length} shapes.`);
		if (!Number.isInteger(elementsInfo.pathIndex))
			throw new Error(`Expected pathIndex to be an integer but got ${elementsInfo.pathIndex}`);
		return paths[elementsInfo.pathIndex];
	}
	return caseInfo.elementsInfo.map(function(elementInfo) {
		if (typeof elementInfo === 'string') {
		}
		else if (elementInfo instanceof Array)
			return new Vector3D(elementInfo);
		else {
			const position = new Vector3D(elementInfo.pos);
			const radius = elementInfo.radius;
			const angle = halfPi;
			const rotationRadians = elementInfo.rotationRadians;
			return new ArcShape(position, rotationRadians, radius, angle, style);
		}
	});
}

export function getRoundedRectTestCases(logger) {
	const simpleRectCases = getSimpleRectTestCases();
	simpleRectCases.forEach(simpleCase => {
		simpleCase.out = false;
		// None of the simple test cases should correspond with a rounded rectangle.
	});
	const cases = [
	{
		'elementsInfo': [
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 5]}, [95, 0]
		],
		'isClosed': true,
		'out': false
		// Too few elements
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 60 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 160 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 260 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 300 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'roundedRectangle 100 200 5',
			'pathIndex': 0
		},
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 100 200 5',
			'pathIndex': 0
		},
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 100 200 60',
			'pathIndex': 0
		},
		'out': false
		/* radii is too large. 50 is the maximum since 2*50 is the minimum dimension. */
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 200 100 60',
			'pathIndex': 0
		},
		'out': false
		/* radii is too large. 50 is the maximum since 2*50 is the minimum dimension.
		Trying with a different dimension than the previous test case.
		*/
	},
	{
		'elementsInfo': [
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 5, 0]}, [95, 0, 0],
			{'radius': 5, 'rotationRadians': halfPi, 'pos': [95, 5, 0]}, [100, 95, 0],
			{'radius': 5, 'rotationRadians': Math.PI, 'pos': [95, 95, 0]}, [5, 100, 0],
			{'radius': 5, 'rotationRadians': Math.PI + halfPi, 'pos': [5, 95, 0]}, [0, 5, 1]
		],
		'isClosed': true,
		'out': false
		// Inconsistent z
	},
	{
		'elementsInfo': [
			{'radius': 55, 'rotationRadians': 0, 'pos': [55, 55]}, [45, 0],
			{'radius': 55, 'rotationRadians': halfPi, 'pos': [100 - 55, 55]}, [100, 100 - 55],
			{'radius': 55, 'rotationRadians': Math.PI, 'pos': [55, 100 - 55]}, [100 - 55, 100],
			{'radius': 55, 'rotationRadians': Math.PI + halfPi, 'pos': [55, 100 - 55]}, [0, 55]
		],
		'isClosed': true,
		'out': false
		// Arc radius is too large compared to positions to leave a gap.
	},
	{
		'elementsInfo': [
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 5]}, [95, 0],
			{'radius': 5, 'rotationRadians': halfPi, 'pos': [95, 5]}, [100, 95],
			{'radius': 5, 'rotationRadians': Math.PI, 'pos': [95, 95]}, [5, 100],
			{'radius': 6, 'rotationRadians': Math.PI + halfPi, 'pos': [5, 95]}, [0, 5]
		],
		'isClosed': true,
		'out': false
		// All the arc radii must be equal.
	},
	{
		'elementsInfo': [
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 5]}, [95, 0],
			{'radius': 5, 'rotationRadians': 0, 'pos': [95, 5]}, [100, 95],
			{'radius': 5, 'rotationRadians': 0, 'pos': [95, 95]}, [5, 100],
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 95]}, [0, 5]
		],
		'isClosed': true,
		'out': false
		// rotationRadians for the arcs must be 90 degrees different.
	},
	{
		'elementsInfo': [
			{'radius': 5, 'rotationRadians': 0, 'pos': [5, 5]}, [95, 0],
			{'radius': 5, 'rotationRadians': halfPi, 'pos': [95, 5]}, [100, 95],
			{'radius': 5, 'rotationRadians': 0, 'pos': [95, 95]}, [5, 100],
			{'radius': 5, 'rotationRadians': halfPi, 'pos': [5, 95]}, [0, 5]
		],
		'isClosed': true,
		'out': false
		/* rotationRadians must either increase or decrease consistently in increments of half pi radians(90 degrees).
		This is with exception to when it may increase at 1.5 PI since rotationRadians is maintained between 0 and 2 PI.
		A change of 1.5 PI corresponds with a full cycle and an offset of half pi.
		*/
	},
	];
	cases.forEach(function(caseInfo) {
		const style = new ShapeStyle(caseInfo.style);
		const elements = caseInfoToElements(caseInfo, style, logger);
		if (elements instanceof PathShape)
			caseInfo.path = elements;
		else
			caseInfo.path = new PathShape(elements, caseInfo.isClosed, style);
		delete caseInfo.coords;
		delete caseInfo.style;
	});
	const result = [];//simpleRectCases;
	ArrayUtils.pushAll(result, cases);
	return result;
};