import { Colour } from '../../../../modules/Colour.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { mergeShapes } from '../../../../modules/drawing/vector/drawing_optimization/mergeShapes.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testAddLineToPath(logger) {
	const line = new LineSegmentShape(new Vector3D(1, 2, 3), new Vector3D(4, 5, 6));
	const polyLines = new PathShape([new Vector3D(1, 2, 3), new Vector3D(10, 9, 8), new Vector3D(20, 18, 16)], false);
	const result = mergeShapes(line, polyLines);
	if (!(result instanceof PathShape))
		logger('PathShape expected but got something else.  result = ' + result);
	else {
		if (result.elements.length !== 4)
			logger('Expected to get 4 points but got ' + result.elements.length);
		else if (!result.elements.some(p => p.equals(new Vector3D(4, 5, 6))))
			logger('Expected to find point (4, 5, 6) in the PathShape but did not.  The points are: ' + result.elements.join(', '));
	}
}

function testNeverAddLineToFilledPath(logger) {
	const line = new LineSegmentShape(new Vector3D(1, 2, 3), new Vector3D(4, 5, 6));
	const filledStyle = new ShapeStyle();
	filledStyle.setFillColor(new Colour('#f00'));
	const polyLines = new PathShape([new Vector3D(1, 2, 3), new Vector3D(10, 9, 8), new Vector3D(20, 18, 16)], true, filledStyle);
	const result = mergeShapes(line, polyLines);
	if (result !== undefined)
		logger('Expected undefined indicating no merge happened but got: ' + result);
}

function testNeverAddLineToClosedPath(logger) {
	const line = new LineSegmentShape(new Vector3D(1, 2, 3), new Vector3D(4, 5, 6));
	const style = new ShapeStyle();
	const polyLines = new PathShape([new Vector3D(1, 2, 3), new Vector3D(10, 9, 8), new Vector3D(20, 18, 16)], true, style);
	const result = mergeShapes(line, polyLines);
	if (result !== undefined)
		logger('Expected undefined indicating no merge happened but got: ' + result);
}

export function testMergeShapes(logger) {
	testAddLineToPath(prefixWrapper('testAddLineToPath', logger));
	testNeverAddLineToFilledPath(prefixWrapper('testNeverAddLineToFilledPath', logger));
	testNeverAddLineToClosedPath(prefixWrapper('testNeverAddLineToClosedPath', logger));
};