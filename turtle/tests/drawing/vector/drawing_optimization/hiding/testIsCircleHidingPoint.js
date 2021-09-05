import { AlphaColour } from
'../../../../../modules/AlphaColour.js';
import { CircleShape } from
'../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from
'../../../../../modules/Colour.js';
import { isCircleHidingPoint } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isCircleHidingPoint.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

await AlphaColour.asyncInit();
await Colour.asyncInit();

export function testIsCircleHidingPoint(logger) {
	const circle1 = new CircleShape(new Vector3D(0, 0, 0), 5);
	circle1.style.setFillColor(new Colour('#000')); // opaque fill
	circle1.style.setPenColor(new Colour('#000')); // opaque pen
	circle1.style.setPenWidth(1);
	
	const semitransparentFillCircle = new CircleShape(new Vector3D(0, 0, 0), 5);
	semitransparentFillCircle.style.setFillColor(new AlphaColour('#8000')); // semitransparent
	semitransparentFillCircle.style.setPenColor(new Colour('#000')); // opaque pen
	semitransparentFillCircle.style.setPenWidth(1);
	const cases = [
		{'inArgs': [circle1, [0, 0]], 'out': true},
		{'inArgs': [circle1, [3, 4]], 'out': true},
		{'inArgs': [circle1, [5, 0]], 'out': true},
		{'inArgs': [circle1, [0, 5]], 'out': true},
		{'inArgs': [circle1, [5.4999, 0]], 'out': true}, // in even with rounding error
		{'inArgs': [circle1, [0, 5.4999]], 'out': true}, // in even with rounding error
		{'inArgs': [circle1, [5.5001, 0]], 'out': false}, // outside with rounding error
		{'inArgs': [circle1, [0, 5.5001]], 'out': false}, // outside with rounding error
		
		{'inArgs': [semitransparentFillCircle, [0, 0]], 'out': false}, 
			// fill is not opaque and the point is just in the filled region.
		{'inArgs': [semitransparentFillCircle, [4.999, 0]], 'out': true}, // hidden by the opaque stroke
		{'inArgs': [semitransparentFillCircle, [5.001, 0]], 'out': true}, // hidden by opaque stroke
		{'inArgs': [semitransparentFillCircle, [5.499, 0]], 'out': true}, // hidden by opaque stroke
		{'inArgs': [semitransparentFillCircle, [5.501, 0]], 'out': false}, // out of range for both pen and fill.
	];
	testInOutPairs(cases, isCircleHidingPoint, logger);
};