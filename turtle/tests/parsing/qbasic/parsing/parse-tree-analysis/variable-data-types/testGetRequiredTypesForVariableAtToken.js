import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getRequiredTypesForVariableAtToken } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/getRequiredTypesForVariableAtToken.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetRequiredTypesForVariableAtToken(logger) {
	const cases = [
	{'code': `print HERE
print x * 4`,
	'result': 'num'},
	{'code': `print HERE
print 2 ^ x`,
	'result': 'num'},
	{'code': `print HERE
sleep x`,
	'result': 'num'},
	{'code': `print HERE
screen x`,
	'result': 'int'}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const hereToken = findToken({'val': 'HERE', 'type': ParseTreeTokenType.IDENTIFIER},
			tokens, plogger);
		if (hereToken === undefined)
			return;
		const result = getRequiredTypesForVariableAtToken('x', hereToken);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but found ${result}`);
	});
};