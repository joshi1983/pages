import { ArcShape } from
'../../../../modules/drawing/vector/shapes/ArcShape.js';
import { LineSegmentShape } from
'../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { preventPathJoin } from
'../../../../modules/command-groups/helpers/drawing/preventPathJoin.js';
import { Vector2DDrawing } from
'../../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testNoShapeCase(logger) {
	try {
		const mockEmptyDrawing = {'foreground': {
			'shapes': []
		}};
		preventPathJoin(mockEmptyDrawing);
		logger(`Exception was expected to be thrown but it was not.`);
	}
	catch (e) {
		if (e.message.indexOf('preventJoinPath') === -1)
			logger(`Exception expected to have message containing preventJoinPath but the message does not message=${e.message}.`);
	}
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
		const drawing = new Vector2DDrawing();
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