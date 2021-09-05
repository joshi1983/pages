import { genericProcessToFromMultipleSourceTokens } from
'../../../../modules/parsing/basic/helpers/genericProcessToFromMultipleSourceTokens.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/basic/qbasic/scanning/scan.js';

export function testGenericProcessToFromMultipleSourceTokens(logger) {
	const renameMap = new Map([
		['go to', 'goto'],
		['bob smith', 'bobsmith']
	]);
	const cases = [
	{
		'code': '',
		'outTokens': []
	},
	{
		'code': 'goto',
		'outTokens': ['goto'] // nothing to change
	},
	{
		'code': 'go to 100',
		'outTokens': ['goto', '100']
	},
	{
		'code': 'for x=go to 100',
		// do not merge the go to here because
		// it is not a goto-statement even if the BASIC dialect supports "go to" using a space.
		'outTokens': ['for', 'x', '=', 'go', 'to', '100']
	},
	{
		'code': 'bob smith 100',
		'outTokens': ['bobsmith', '100']
	}
	];
	const merge = genericProcessToFromMultipleSourceTokens(renameMap);
	cases.forEach(function(caseInfo, index) {
		const tokens = scan(caseInfo.code);
		merge(tokens);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (tokens.length !== caseInfo.outTokens.length)
			plogger(`Expected ${caseInfo.outTokens.length} tokens but found ${tokens.length}.  The actual token s values are ${tokens.map(t => t.s).join(',')}`);
		else {
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				const info = caseInfo.outTokens[i];
				const tplogger = prefixWrapper(`Checking token ${i}`, plogger);
				let s;
				if (typeof info === 'string')
					s = info;
				else if (typeof info === 'object') {
					s = info.s;
				}
				if (s !== token.s)
					tplogger(`Expected s to have a value of ${s} but found ${token.s}`);
			}
		}
	});
};
