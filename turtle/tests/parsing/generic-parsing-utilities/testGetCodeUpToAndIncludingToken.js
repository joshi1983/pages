import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getCodeUpToAndIncludingToken } from
'../../../modules/parsing/generic-parsing-utilities/getCodeUpToAndIncludingToken.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetCodeUpToAndIncludingToken(logger) {
	const cases = [
		{'code': 'fd', 'token': {'val': 'fd'}, 'out': 'fd'},
		{'code': 'fd 1', 'token': {'val': '1'}, 'out': 'fd 1'},
		{'code': 'fd 12', 'token': {'val': '12'}, 'out': 'fd 12'},
		{'code': 'fd 1 ', 'token': {'val': '1'}, 'out': 'fd 1'},
		{'code': 'fd 1', 'token': {'val': 'fd'}, 'out': 'fd'},
		{'code': 'fd \n1', 'token': {'val': 'fd'}, 'out': 'fd'},
		{'code': 'fd \n1', 'token': {'val': '1'}, 'out': 'fd \n1'},
		{'code': 'fd(\n1)', 'token': {'val': ')'}, 'out': 'fd(\n1)'},
		{'code': 'fd(\n1);', 'token': {'val': ';'}, 'out': 'fd(\n1);'},
		{'code': 'fd(\n1);', 'token': {'val': ')'}, 'out': 'fd(\n1)'},
		{'code': 'fd(\n1);', 'token': {'val': '1'}, 'out': 'fd(\n1'},
		{'code': 'fd(\n1);', 'token': {'val': '('}, 'out': 'fd('},
		{'code': 'fd(\n1);', 'token': {'val': 'fd'}, 'out': 'fd'},
		{'code': `fd(\n1\n);`, 'token': {'val': ';'}, 'out': 'fd(\n1\n);'},
		{'code': `fd(\n1\n)\n;`, 'token': {'val': ';'}, 'out': 'fd(\n1\n)\n;'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const result = getCodeUpToAndIncludingToken(caseInfo.code, token);
			if (result !== caseInfo.out) {
				plogger(`Expected "${caseInfo.out}" but got "${result}".  The expected length was ${caseInfo.out.length} but the actual length was ${result.length}`);
			}
		}
	});
};