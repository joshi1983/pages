import { findToken } from '../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { getParseTokensSorted } from '../../../../../modules/parsing/parse-tree-token/getParseTokensSorted.js';
import { getTokenAfter } from '../../../../../modules/components/code-editor/code-fixer/fixers/getTokenAfter.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testGetTokenAfter(logger) {
	const cases = [
	{'code': 'fd 100', 'in': {
		'val': 'fd'
	}, 'out': {
		'val': 100
	}},
	{
		'code': 'repeat 10 next Repeat 20 Next fd 15',
		'in': {
			'val': 10
		},
		'out': {
			'val': 'next'
		}
	},
	{
		'code': `REPEAT 180
  DRAW 1
  RIGHT 2
NEXT
REPEaT 180
  DRAw 3
  RIGHt 4
NEXt`, 'in': {
	'val': 2,
}, 'out': {
	'val': 'NEXT'
}
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = tree.getAllTokens();
		getParseTokensSorted(allTokens);
		const inToken = findToken(caseInfo.in, allTokens, plogger);
		const outToken = findToken(caseInfo.out, allTokens, plogger);
		if (inToken === undefined)
			plogger('in token expected to be found but it was not');
		else {
			const result = getTokenAfter(allTokens, inToken);
			if (outToken !== result)
				plogger(`Expected token ${outToken} but got ${result}.  inToken=${inToken}`);
		}
	});
};