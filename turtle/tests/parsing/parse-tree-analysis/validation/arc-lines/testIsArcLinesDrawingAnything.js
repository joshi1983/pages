import { isArcLinesDrawingAnything } from
'../../../../../modules/parsing/parse-tree-analysis/validation/arc-lines/isArcLinesDrawingAnything.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';

export function testIsArcLinesDrawingAnything(logger) {
	const cases = [
	{'in': [], 'out': false},
	{'in': [[0]], 'out': false},
	{'in': [[90, 0]], 'out': false},
	{'in': [[90, 1]], 'out': true},
	{'in': [[1]], 'out': true},
	{'in': [[-1]], 'out': true}
	];
	testInOutPairs(cases, isArcLinesDrawingAnything, logger);
};