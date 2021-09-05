import { LineCap } from '../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function caseInfoToElements(caseInfo) {
	if (caseInfo.coords !== undefined) {
		return caseInfo.coords.map(function(coords) {
			const result = new Vector3D(coords);
			return result;
		});
	}
}

export function getSimpleRectTestCases() {
	const cases = [
	{
		'coords': [[0, 0], [100, 0], [100, 100]],
		'isClosed': true,
		'out': false
	},
	{// square
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100]],
		'isClosed': true,
		'rotation': 0,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'out': true
	},
	{// square
		'coords': [[0, 0], [0, 100], [100, 100], [100, 0]],
		'rotation': 0,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'isClosed': true,
		'out': true
	},
	{// another square
		'coords': [[10, 10], [100, 10], [100, 100], [10, 100]],
		'isClosed': true,
		'rotation': 0,
		'x': 10,
		'y': 10,
		'width': 90,
		'height': 90,
		'out': true
	},
	{ // non-rectangle
		'coords': [[0, 0], [100, 0], [100, 200], [100, 300]],
		'isClosed': true,
		'out': false
		// line lengths are fine but the last point would have to be [0, 200] to 
		// complete the rectangle.
	},
	{ // non-rectangle
		'coords': [[0, 0], [100, 0], [100, 200], [200, 200]],
		'isClosed': true,
		'out': false
		// line lengths are fine but the last point would have to be [0, 200] to 
		// complete the rectangle.
	},
	{ // non-square rectangle
		'coords': [[0, 0], [100, 0], [100, 200], [0, 200]],
		'isClosed': true,
		'rotation': 0,
		'width': 100,
		'height': 200,
		'x': 0,
		'y': 0,
		'out': true
	},
	{ // non-rectangle
		'coords': [[0, 0], [10, 0], [100, 200], [0, 200]],
		'isClosed': true,
		'out': false
	},
	{ // another non-rectangle
		'coords': [[0, 0], [100, 0], [100, 200], [0, 20]],
		'isClosed': true,
		'out': false
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100]],
		'isClosed': false,
		'out': false 
		// an unclosed rect with 4 elements can't be represented by a rect because 
		// the SVG rect would show 4 line segments when the drawing on canvas would show only 3.
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
		'isClosed': true,
		'rotation': 0,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'out': true
	},
	{
		'coords': [[0, 0], [100, 0], [200, 100], [100, 100], [0, 0]],
		'isClosed': true,
		'out': false
		// 45-degree parallelogram
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
		'style': {
			'pen': {
				'lineCap': LineCap.Round,
				'lineJoinStyle': LineJoinStyle.Round
			}
		},
		'isClosed': false,
		'rotation': 0,
		'x': 0,
		'y': 0,
		'width': 100,
		'height': 100,
		'out': true // should have fill="none" but can still be represented by an SVG rect element.
		// Since both line cap and line join style are the same, the last corner will look 
		// the exact same whether it actually joins or not.
	},
	{
		'coords': [
			[-98.4807753012208,-17.36481776669304],
			[-115.84559306791384,81.11595753452777],
			[81.1159575345278,115.84559306791381],
			[98.48077530122082,17.364817766693008]
		],
		'isClosed': true,
		'x': 0,
		'y': -100,
		'rotation': 100,
		'width': 100,
		'height': 200,
		'out': true
	},
	{
		'coords': [
			[-98.4807753012208,17.364817766693033],
			[-81.11595753452777,115.84559306791384],
			[115.84559306791384,81.11595753452778],
			[98.48077530122079,-17.364817766693022]
		],
		'isClosed': true,
		'x': 0,
		'y': -100,
		'rotation': 80,
		'width': 100,
		'height': 200,
		'out': true
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
		'style': {
			'pen': {
				'lineCap': LineCap.Round,
			}
		},
		'isClosed': false,
		'out': false // round line cap won't match the miter joins on 3 other corners.
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
		'style': {
			'pen': {
				'lineJoinStyle': LineJoinStyle.Round
			}
		},
		'isClosed': false,
		'out': false // 3 round corners and 1 disconnected sharp edge one won't match.
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
		'isClosed': false,
		'out': false // not acceptable because a very subtle difference would 
		//show at the last corner of the rectangle.
		// The rect would join together like every other corner.
		// The WebLogo drawing and how it shows on canvas would be different.
		// The canvas version is the one we want.
	},
	{
		'coords': [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0], [0, 0]],
		'isClosed': true,
		'out': false // too many elements in path.
	},
	];
	return cases.map(function(caseInfo) {
		const result = {};
		Object.assign(result, caseInfo);
		const elements = caseInfoToElements(caseInfo);
		const style = new ShapeStyle(caseInfo.style);
		delete result.coords;
		delete result.style;
		result.path = new PathShape(elements, caseInfo.isClosed, style);
		return result;
	});
};