import { ArcShape } from
'../../../../modules/drawing/vector/shapes/ArcShape.js';
import { LineSegmentShape } from
'../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { preventPathJoin } from
'../../../../modules/command-groups/helpers/drawing/preventPathJoin.js';
import { VectorDrawing } from
'../../../../modules/drawing/vector/VectorDrawing.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testNoShapeCase(logger) {
	preventPathJoin(new VectorDrawing());
}

function testWithShapes(logger) {
	const cases = [
	{'prev': new LineSegmentShape(new Vector3D(), new Vector3D(0, 0, 100)),
	'next': new LineSegmentShape(new Vector3D(), new Vector3D(100, 0, 0))},
	{'prev': new ArcShape(new Vector3D(), 0, 100, Math.PI),
	'next': new LineSegmentShape(new Vector3D(), new Vector3D(100, 0, 0))},
	{'prev': new ArcShape(new Vector3D(), 0, 100, Math.PI),
	'next': new LineSegmentShape(new Vector3D(), new Vector3D(100, 0, 0))},
	{'next': new ArcShape(new Vector3D(), 0, 100, Math.PI),
	'prev': new ArcShape(new Vector3D(), Math.PI, 100, Math.PI)}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawing = new VectorDrawing();
		drawing.addForegroundShape(caseInfo.prev);
		preventPathJoin(drawing);
		if (caseInfo.prev.preventPathJoin !== true)
			plogger(`Expected preventPathJoin to be true but found ${caseInfo.preventPathJoin}`);
		
		const nextShape = caseInfo.next;
		// try to optimize and merge with the next shape.
		// The merging should be prevented.
		drawing.addForegroundShape(nextShape, true);
		const shapes = drawing.foreground.shapes;
		if (shapes.length !== 2) {
			plogger(`Expected 2 shapes but found ${shapes.length}`);
		}
	});
}

export function testPreventPathJoin(logger) {
	wrapAndCall([
		testNoShapeCase,
		testWithShapes,
	], logger);
};