import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getUnmutatableGlobalVariables } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/getUnmutatableGlobalVariables.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetUnmutatableGlobalVariables(logger) {
	const cases = [
		{
			'in': 'make "x 3',
			'out': ['x']
		},
		{
			'in': 'make "x pi',
			'out': ['x']
		},
		{
			'in': 'make "x "red',
			'out': ['x']
			// string and colorstring can't be mutated.
		},
		{
			'in': 'make "x "#123',
			'out': ['x']
			// colorstring can't be mutated.
		},
		{
			'in': 'make "x "#8123',
			'out': ['x']
			// alphacolorstring can't be mutated.
		},
		{
			'in': 'make "x "hello',
			'out': ['x']
			// string can't be mutated.
		},
		{
			'in': 'make "x true',
			'out': ['x']
			// bool can't be mutated.
		},
		{
			'in': 'make "x transparent',
			'out': ['x']
			// transparent can't be mutated.
		},
		{
			'in': 'make "x []',
			'out': []
		}, // x is mutatable with commands like setItem, queue2..
		{
			'in': 'make "x createPList',
			'out': []
		}, // x is mutatable with commands like setProperty..
		{
			'in': `make "x 3
make "y 1`,
			'out': ['x', 'y']
		},
		{
			'in': `to p :x
	make "x 4
end`,
			'out': []
			// x is a local variable here because of the parameter declaration.
		},
		{
			'in': `to p
	localmake "x 4
end`,
			'out': []
			// again, x is a local variable.
		},
		{
			'in': `make "x 3
make "x []`,
			'out': []
			// x was assigned a list which can be mutated.
			// It shouldn't be in the result because it might get mutated.
		},
		{
			'in': `make "x []
make "y 3
swap "x "y`,
			'out': []
			// just to be simple and safe, let's exclude any variables referenced in a swap that might be global.
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.in, logger);
		const result = getUnmutatableGlobalVariables(cachedParseTree);
		if (!(result instanceof Set))
			plogger(`Result must be a Set but found ${result}`);
		else if (caseInfo.out.length !== result.size)
			plogger(`Expected ${caseInfo.out.length} but found size to be ${result.size}`);
		else {
			for (const name of caseInfo.out) {
				if (!result.has(name))
					plogger(`Expected to find variable ${name}.  Not found.`);
			}
		}
	});
};