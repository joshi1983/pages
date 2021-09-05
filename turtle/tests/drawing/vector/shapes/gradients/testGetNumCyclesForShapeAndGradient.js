import { CircleShape } from
'../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from
'../../../../../modules/Colour.js';
import { getNumCyclesForShapeAndGradient } from
'../../../../../modules/drawing/vector/shapes/gradients/getNumCyclesForShapeAndGradient.js';
import { LinearGradient } from
'../../../../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { SpreadMethod } from
'../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector2D } from
'../../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';
await Colour.asyncInit();

export function testGetNumCyclesForShapeAndGradient(logger) {
	const colorStops = new Map([
		[0, new Colour('#000')],
		[1, new Colour('#fff')]
	]);
	const cases = [
	{'inArgs': [new CircleShape(new Vector3D(0, 0, 0), 100),
	new LinearGradient(colorStops, new Vector2D(0, 0), new Vector2D(100, 0), SpreadMethod.Pad)], 'out': 1},
	{'inArgs': [new CircleShape(new Vector3D(0, 0, 0), 100),
	new LinearGradient(colorStops, new Vector2D(0, 0), new Vector2D(10, 0), SpreadMethod.Pad)], 'out': 1},
	{'inArgs': [new CircleShape(new Vector3D(0, 0, 0), 100),
	new LinearGradient(colorStops, new Vector2D(-100.1, 0), new Vector2D(101, 0), SpreadMethod.Repeat)], 'out': 2
	// 1 or 2 are both acceptable return values for this case.
	},
	{'inArgs': [new CircleShape(new Vector3D(0, 0, 0), 100),
	new LinearGradient(colorStops, new Vector2D(0, 0), new Vector2D(9.99, 0), SpreadMethod.Repeat)], 'out': 41},
	{'inArgs': [new CircleShape(new Vector3D(0, 0, 0), 100),
	new LinearGradient(colorStops, new Vector2D(0, 0), new Vector2D(4.99, 0), SpreadMethod.Repeat)], 'out': 81}
	];
	testInOutPairs(cases, getNumCyclesForShapeAndGradient, logger);
};