import { ParseTreeTokenType } from
'../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processAssignmentPrefix } from
'../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/operators/processAssignmentPrefix.js';
import { processProcessTestCases } from
'./processProcessTestCases.js';

export function testProcessAssignmentPrefix(logger) {
	const cases = [
	{'code': 'x = 4;', 'token': {'val': 'x'}, 'out': 'make "x '},
	{'code': 'void p() {int x = 4;}', 'token': {'val': 'x'}, 'out': 'localmake "x '},
	{'code': 'this.x = 4;',
		'token': {'val': 'x'},
		'out': 'setProperty "this "x '},
	{'code': 'x.y = 4;',
		'token': {'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null},
		'out': 'setProperty "x "y '},
	{'code': 'x[0] = 4;',
		'token': {'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION},
		'out': 'setItem 1 "x '},
	];
	processProcessTestCases(cases, processAssignmentPrefix, logger);
};