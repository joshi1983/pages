import { optimizeClosedPath } from '../../../../modules/drawing/vector/drawing_optimization/optimizeClosedPath.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function pathInfoToPathShape(pathInfo) {
	const elements = pathInfo.elements.map(e => {
		if (e instanceof Array)
			return new Vector3D(e);
	});
	const isClosed = pathInfo.isClosed === true;
	return new PathShape(elements, isClosed);
}

export function testOptimizeClosedPath(logger) {
	const cases = [
		{
			'inPath': {
				'elements': [[0, 0], [10, 0], [10, 10], [0, 0]],
				'isClosed': true
			},
			'outPath': {
				'elements': [[10, 0], [10, 10], [0, 0]],
				'isClosed': true
			}
			// remove first element because it is redundant.
		},
		{
			'inPath': {
				'elements': [[10, 0], [10, 10], [0, 0]],
				'isClosed': true
			},
			'outPath': {
				'elements': [[10, 0], [10, 10], [0, 0]],
				'isClosed': true
			}
			// no change expected.
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const inPath = pathInfoToPathShape(caseInfo.inPath);
		optimizeClosedPath(inPath);
		const outPath = pathInfoToPathShape(caseInfo.outPath);
		if (inPath.elements.length !== outPath.elements.length)
			plogger(`Expected ${outPath.elements.length} elements but got ${inPath.elements.length}`);
		if (inPath.isClosed !== outPath.isClosed)
			plogger(`Expected isClosed to be ${outPath.isClosed} but got ${inPath.isClosed}`);
	});
	
};