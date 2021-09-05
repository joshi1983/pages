import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { getVariablesFromCode } from '../getVariablesFromCode.js';
import { mightQueue2MutateManyVariables } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/mightQueue2MutateManyVariables.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testMightQueue2MutateManyVariables(logger) {
	const cases = [
	{'code': '', 'out': false},
	{'code': 'make "x []\nqueue2 "x 5', 'out': false},
	{'code': 'make "x []\nmake "y :x\nqueue2 "y 5', 'out': true},
	/*
	true because y is being mutated which also mutates x.
	*/

	{'code': 'to p\nmake "x []\nqueue2 "x 5\nend', 'out': false},
	{'code': 'to p\nmake "x (list 1 2)\nqueue2 "x 5\nend', 'out': false},
	{'code': 'to p\nmake "x ((list 1 2))\nqueue2 "x 5\nend', 'out': false},
	{'code': 'to p\nmake "x list 1 2\nqueue2 "x 5\nend', 'out': false},
	{'code': 'to p\nlocalmake "x []\nqueue2 "x 5\nend', 'out': false},
	{'code': 'to p2 :list1\nqueue2 "list1 5\nend', 'out': false},
	{'code': 'to p :list1\nqueue2 "list1 5\nend\np []', 'out': true},
	{'code': 'to p :list1\ndequeue2 "list1 5\nend\np [1 3]', 'out': true},
	{'code': `make "offsets [60 90 120]
make "points []
queue2 "points pos
repeat 2 [
	print 3 + (item repcount :offsets)
		]`, 'out': false}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = getVariablesFromCode(caseInfo.code, plogger);
		const result = mightQueue2MutateManyVariables(tree, variables);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};