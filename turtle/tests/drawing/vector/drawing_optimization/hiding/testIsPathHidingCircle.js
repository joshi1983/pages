import { ArcShape } from '../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../../../modules/Colour.js';
import { isPathHidingCircle } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/isPathHidingCircle.js';
import { PathShape } from '../../../../../modules/drawing/vector/shapes/PathShape.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function testIsPathHidingCircle(logger) {
	const thickPenStyle = new ShapeStyle();
	thickPenStyle.setPenColor(new Colour("black"));
	thickPenStyle.setPenWidth(20);
	const cases = [{
		'inArgs': [
		new PathShape([new Vector3D(1,2,0), new Vector3D(5,2,0)], false),
		new CircleShape(new Vector3D(1,2,0), 10)
	], 'out': false},{
		'inArgs': [
		new PathShape([new Vector3D(0, 0, 0), new ArcShape(new Vector3D(0, 0, 0), 0, 10, Math.PI * 2)], false),
		new CircleShape(new Vector3D(1,0,0), 1)
	], 'out': true},{
		'inArgs': [
		new PathShape([new Vector3D(0, 0, 0), new ArcShape(new Vector3D(0, 0, 0), 0, 10, Math.PI * 2)], false),
		new CircleShape(new Vector3D(0,0,0), 10)
	], 'out': true},{
		'inArgs': [
		new PathShape([new Vector3D(0, 0, 0), new ArcShape(new Vector3D(0, 0, 0), 0, 10, Math.PI * 2)], false),
		new CircleShape(new Vector3D(0,0,0), 12)
	], 'out': false},{
		'inArgs': [
		new PathShape([new Vector3D(0, 0, 0), new ArcShape(new Vector3D(0, 0, 0), 0, 10, Math.PI * 2)], false),
		new CircleShape(new Vector3D(0,0,0), 1, thickPenStyle)
	], 'out': false}];
	testInOutPairs(cases, isPathHidingCircle, logger);
};