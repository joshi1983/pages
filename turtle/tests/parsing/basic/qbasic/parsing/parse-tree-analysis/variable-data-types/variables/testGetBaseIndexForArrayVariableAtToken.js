import { findToken } from
'../../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getBaseIndexForArrayVariableAtToken } from
'../../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/variables/getBaseIndexForArrayVariableAtToken.js';
import { parse } from
'../../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { parseRootToOptionsMock } from
'../../../../translation-to-weblogo/parseRootToOptionsMock.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';

export function testGetBaseIndexForArrayVariableAtToken(logger) {
	const cases = [
	{'code': 'DIM x', 'dimensionIndex': 0, 'out': 0},
	{'code': 'DIM x(0 to 9)', 'dimensionIndex': 0, 'out': 0},
	{'code': 'DIM x(&h00 to 9)', 'dimensionIndex': 0, 'out': 0},
	{'code': 'DIM x(1 to 9)', 'dimensionIndex': 0, 'out': 1},
	{'code': 'DIM x(1 to 9, 2 to 4)',
	'dimensionIndex': 0, 'out': 1},
	{'code': 'DIM x(1 to 9, 2 to 4)',
	'dimensionIndex': 1, 'out': 2},
	{'code': 'DIM x(5)',
	'dimensionIndex': 0, 'out': 0},
	{'code': 'DIM x(5,4)',
	'dimensionIndex': 0, 'out': 0},
	{'code': 'x(0) = 3',
	'dimensionIndex': 0, 'out': 0},
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code + '\nprint';
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const tokenInfo = {'val': 'print'};
		const token = findToken(tokenInfo, tokens, plogger);
		if (token === undefined)
			return;
		const options = parseRootToOptionsMock(parseResult.root);
		if (!options.variables.has('x')) {
			plogger(`A variable named x was expected to be found but it was not.  The only variables found were ${Array.from(options.variables.values()).map(v => v.name)}`);
			return;
		}
		const result = getBaseIndexForArrayVariableAtToken('x', token, caseInfo.dimensionIndex, options);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};