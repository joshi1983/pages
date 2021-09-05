import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getOutputValueTokenForProcedure } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/getOutputValueTokenForProcedure.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function returnsDefinedTokenValue(logger) {
	return function(code) {
		const plogger = prefixWrapper(`code: ${code}`, logger);
		const ctree = getCachedParseTreeFromCode(code, plogger);
		const procs = ctree.getProceduresMap();
		if (procs.size !== 1)
			plogger(`Expected 1 procedure but found ${procs.size}`);
		else {
			const proc = procs.values().next().value;
			const valueToken = getOutputValueTokenForProcedure(proc);
			return valueToken !== undefined;
		}
		return false;
	};
}

export function testGetOutputValueTokenForProcedure(logger) {
	const cases = [
		{'in': `to p
end`, 'out': false},
		{'in': `to p
	stop
end`, 'out': false},
		{'in': `to p
	if randomRatio < 0.4 [
		output 4
	]
end`, 'out': false},
		{'in': `to p
	forever [
		break
		output 3
	]
end`, 'out': false},
		{'in': `to p
	forever [
		if randomRatio < 0.4 [
			break
		]
		output 3
	]
end`, 'out': false},
		{'in': `to p
	forever [
		ifelse randomRatio < 0.4 [
			break
		]
		output 3
	]
end`, 'out': false},
		{'in': `to p
	forever [
		output 3
	]
end`, 'out': true},
		{'in': `to p
	output 4
end`, 'out': true},
		{'in': `to p
	output :x + :y
end`, 'out': true},
		{'in': `to p
	(output :x + :y) ; weird to use the brackets but let's handle the case properly anyway.
end`, 'out': true},
	];
	testInOutPairs(cases, returnsDefinedTokenValue(logger), logger);
};