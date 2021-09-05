import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { mightExecuteDifferently } from
'../../../modules/components/code-editor/mightExecuteDifferently.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function codeToParseTree(code, logger) {
	const cachedParseTree = getCachedParseTreeFromCode(code, logger, false);
	return cachedParseTree.root;
}

function mightExecuteDifferentlyWrapped(logger) {
	return function(code1, code2) {
		return mightExecuteDifferently(codeToParseTree(code1, logger), codeToParseTree(code2, logger));
	};
}

export function testMightExecuteDifferently(logger) {
	const cases = [
	{'inArgs': ['', ''], 'out': false},
	{'inArgs': ['', ';'], 'out': false},
	{'inArgs': ['', '; hello'], 'out': false},
	{'inArgs': ['fd 1', 'fd 1 '], 'out': false},
	{'inArgs': ['fd 1', 'forward 1'], 'out': false},
	{'inArgs': ['fd 10', 'fd 1'], 'out': true},
	{'inArgs': ['fd 1', 'fd 1 r'], 'out': true},
	{'inArgs': ['fd 1', 'fd 1 repeat'], 'out': true},
	{'inArgs': ['fd 1', 'fd 1 repeat 4 []'], 'out': true},
	];
	testInOutPairs(cases, mightExecuteDifferentlyWrapped(logger), logger);
};