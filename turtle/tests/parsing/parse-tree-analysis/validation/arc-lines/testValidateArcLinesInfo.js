import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { validateArcLinesInfo } from
'../../../../../modules/parsing/parse-tree-analysis/validation/arc-lines/validateArcLinesInfo.js';

export function testValidateArcLinesInfo(logger) {
	const cases = [
	{'in': [[1]], 'out': undefined},
	{'in': [[90, 0.4]], 'out': undefined},
	{'in': [[90, "hi"]], 'out': 'Every element in the arcLines data must contain numbers but found something else at item 1.'},
	{'in': [["hi", 4]], 'out': 'Every element in the arcLines data must contain numbers but found something else at item 1.'},
	{'in': ["hi"], 'out': 'Every element must be a list but found something else at item 1.'},
	{'in': [[]], 'out': 'Empty list at item 1 is not a valid element for arcLines data.'},
	{'in': [[1,2,3]], 'out': 'No list can be longer than 2 but found a list with count 3 at item 1.'},
	{'in': [["hi"]], 'out': 'Every element in the arcLines data must contain numbers but found something else at item 1.'},
	];
	testInOutPairs(cases, validateArcLinesInfo, logger);
};