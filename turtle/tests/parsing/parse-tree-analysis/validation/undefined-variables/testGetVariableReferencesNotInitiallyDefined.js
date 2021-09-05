import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getVariableReferencesNotInitiallyDefined } from
'../../../../../modules/parsing/parse-tree-analysis/validation/undefined-variables/getVariableReferencesNotInitiallyDefined.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetVariableReferencesNotInitiallyDefined(logger) {
	const cases = [
	{'code': '', 'numTokens': 0},
	{'code': 'fd 4', 'numTokens': 0},
	{'code': 'make "x 4', 'numTokens': 0},
	{'code': `to p
end`, 'numTokens': 0},
	{'code': `to p :x
	print :x
end`, 'numTokens': 0},
	{'code': `to p
	print :x
end make "x 4`, 'numTokens': 0},
	{'code': `to p
	print :x
end make "x 4`, 'numTokens': 0},
	{'code': `to p
	print :x
end make "x 4`, 'numTokens': 0},
	{'code': `to p
	repeat 2 [
		print :x
		localmake "x 4
	]
end`, 'numTokens': 1},
	{'code': `to p
	repeat 2 [
		print :X
		localmake "x 4
	]
end`, 'numTokens': 1},
	{'code': `to p
	repeat 2 [
		queue2 "x 4
		localmake "x []
	]
end`, 'numTokens': 1},
	{'code': `to p
	repeat 2 [
		queue2 "X 4
		localmake "x []
	]
end`, 'numTokens': 1},
	{'code': `to p
	repeat 2 [
		queue2 "X 4
		localmake "x []
	]
end
make "x []`, 'numTokens': 0},
	{'code': `to p
	repeat 2 [
		if repcount = 2 [
			queue2 "X 4
		]
		localmake "x []
	]
end`, 'numTokens': 0},
	{'code': `to p
	repeat 2 [
		ifelse repcount = 2 [
			queue2 "X 4
		] [
		
		]
		localmake "x []
	]
end`, 'numTokens': 0}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = getVariableReferencesNotInitiallyDefined(tree);
		if (tokens.length !== caseInfo.numTokens)
			plogger(`Expected numTokens ${caseInfo.numTokens} but got ${tokens.length}`);
	});
};