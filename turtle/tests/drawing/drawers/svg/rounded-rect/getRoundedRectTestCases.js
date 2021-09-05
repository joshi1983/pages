import { ArrayUtils } from '../../../../../modules/ArrayUtils.js';
import { getSimpleRectTestCases } from '../getSimpleRectTestCases.js';
import { processRectangleCaseInfo } from '../processRectangleCaseInfo.js';

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

export function getRoundedRectTestCases(logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but got ${logger}`);
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
			'code': `make "r 10
right 90
polyStart
jumpforward 100
arcleft 90 :r
jumpForward 100
arcLeft 90 :r
jumpForward 100
arcleft 90 :r
jumpForward 100
arcleft 90 :r
polyEnd`,
			'pathIndex': -1 // last index
		},
		'width': 120,
		'height': 120,
		'rx': 10,
		'out': true
	},
	{
		'elementsInfo': {
			'code': `make "r 10
right 30
polyStart
jumpforward 100
arcleft 90 :r
jumpForward 100
arcLeft 90 :r
jumpForward 100
arcleft 90 :r
jumpForward 100
arcleft 90 :r
polyEnd`,
			'pathIndex': -1 // last index
		},
		'x': -10,
		'y': 0,
		'width': 120,
		'height': 120,
		'rx': 10,
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': `make "r 10
right 30
polyStart
jumpforward 100
arcleft 90 :r
jumpForward 100
arcLeft 90 :r
jumpForward 100
arcleft 90 :r
jumpForward 100
arcleft 90 :r
polyEnd`,
			'pathIndex': 0 // first index
		},
		'x': -10,
		'y': 0,
		'width': 120,
		'height': 120,
		'rx': 10,
		'out': true
		// same as before case but different pathIndex
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'noTransform': true,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'roundedRectangle 100 100 5',
			'pathIndex': 1
		},
		'noTransform': true,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
		// same as previous case but pathIndex is 1.
		// remove this test case if/when only 1 path is found.
		// We eventually want to remove redundant paths that are hidden by overlapping paths.
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 60 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 160 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 260 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 300 roundedRectangle 100 100 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 100,
		'rx': 5,
		'out': true
		// same as before but different rotation
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'roundedRectangle 100 200 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 200,
		'rx': 5,
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 100 200 5',
			'pathIndex': 0
		},
		'width': 100,
		'height': 200,
		'rx': 5,
		'out': true
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 100 200 60',
			'pathIndex': 0
		},
		'out': false
		// radii is too large. 50 is the maximum since 2*50 is the minimum dimension.
	},
	{
		'elementsInfo': {
			'code': roundedRectProcedure + 'right 30 roundedRectangle 200 100 60',
			'pathIndex': 0
		},
		'out': false
		// radii is too large. 50 is the maximum since 2*50 is the minimum dimension.
		//Trying with a different dimension than the previous test case.
	},
	{
		'elementsInfo': {
			'code': `setLineCap "round
fd 53
arcRight 90 40
fd 10
arcRight 90 40
fd 10
arcRight 90 40
fd 10
arcRight 90 40`,
			'pathIndex': 0
		},
		'out': false
	},
	{
		'elementsInfo': {
			'code': `setPenSize 15
		repeat 4 [
			arcRight 90 20
			forward 20
		]`,
			'pathIndex': 0
		},
		'rx': 20,
		'x': 0,
		'y': -40,
		'width': 60,
		'height': 60,
		'out': true
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
		// rotationRadians must either increase or decrease consistently in increments of half pi radians(90 degrees).
		//This is with exception to when it may increase at 1.5 PI since rotationRadians is maintained between 0 and 2 PI.
		//A change of 1.5 PI corresponds with a full cycle and an offset of half pi.
	},
	];
	cases.forEach(processRectangleCaseInfo(logger));
	const result = [];//simpleRectCases;
	ArrayUtils.pushAll(result, cases);
	return result;
};