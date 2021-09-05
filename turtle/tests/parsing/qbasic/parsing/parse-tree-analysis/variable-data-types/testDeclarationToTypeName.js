import { declarationToTypeName } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/declarationToTypeName.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testDeclarationToTypeName(logger) {
	const cases = [
		{'code': 'defint x', 'out': 'integer'},
		{'code': 'DEFINT x', 'out': 'integer'},
		{'code': 'deflng x', 'out': 'long'},
		{'code': 'defstr x', 'out': 'string'},
		{'code': 'dim x as _byte', 'out': '_byte'},
		{'code': 'DIM x AS _BYTE', 'out': '_byte'},
		{'code': 'dim x as integer', 'out': 'integer'},
		{'code': 'dim x as INTEGER', 'out': 'integer'},
		{'code': 'dim x as _INTEGER64', 'out': '_integer64'},
		{'code': 'dim x as _unsigned _byte', 'out': '_unsigned _byte'},
		{'code': 'dim x as _unsigned _INTEGER64', 'out': '_unsigned _integer64'},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = flatten(parseResult.root);
		const declarationToken = findToken({'val': 'x'}, tokens, plogger);
		if (declarationToken === undefined)
			return;

		const result = declarationToTypeName(declarationToken);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};