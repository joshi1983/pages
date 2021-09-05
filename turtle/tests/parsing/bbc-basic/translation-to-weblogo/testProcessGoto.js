import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processGoto } from
'../../../../modules/parsing/bbc-basic/translation-to-weblogo/processGoto.js';
import { scan } from
'../../../../modules/parsing/qbasic/scanning/scan.js';

export function testProcessGoto(logger) {
	const cases = [
	{
		'code': '',
		'outTokenCode': ''
	},
	{
		'code': 'print "hi"',
		'outTokenCode': 'print "hi"'
	},
	{
		'code': 'then',
		'outTokenCode': 'then'
	},
	{'code': `Z=1
IF Z>0 THEN 350
PRINT "hello"
350`,
'outTokenCode': `Z=1
IF Z>0 THEN goto 350
PRINT "hello"
350`
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = scan(caseInfo.code);
		processGoto(tokens);
		const outTokens = scan(caseInfo.outTokenCode);
		if (tokens.length !== outTokens.length)
			plogger(`Expected ${outTokens.length} tokens but found ${tokens.length}`);
		else {
			for (let i = 0; i < tokens.length; i++) {
				const token1 = tokens[i];
				const token2 = outTokens[i];
				if (token1.s !== token2.s)
					plogger(`At index ${i}, expected ${token2.s} but found ${token1.s}`);
			}
		}
	});
};