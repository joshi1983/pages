import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { CircleShape } from '../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../../../modules/Colour.js';
import { isCircleHidingCircle } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isCircleHidingCircle.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';
await Colour.asyncInit();

export function testIsCircleHidingCircle(logger) {
	const opaqueStyle = new ShapeStyle();
	opaqueStyle.setFillColor(new Colour("red"));
	const semitransparentStyle = new ShapeStyle();
	semitransparentStyle.setFillColor(new AlphaColour('#88000000'));
	const cases = [
	{'inArgs': [
		new CircleShape(new Vector3D(1,2,0), 9, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': false},
	{'inArgs': [
		new CircleShape(new Vector3D(1,2,0), 9.9, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': false},
	{'inArgs': [
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': true},
	{'inArgs': [
		new CircleShape(new Vector3D(1,2,0), 100, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': true},
	{'inArgs': [
		new CircleShape(new Vector3D(1,2,0), 100, semitransparentStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': false},
	{'inArgs': [
		new CircleShape(new Vector3D(0,2,0), 100, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': true},
	{'inArgs': [
		new CircleShape(new Vector3D(0,2,0), 10, opaqueStyle),
		new CircleShape(new Vector3D(1,2,0), 10, opaqueStyle)
	], 'out': false},
	];
	testInOutPairs(cases, isCircleHidingCircle, logger);
};