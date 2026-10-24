import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { scanToQBasicTokens } from
'../../../../../../modules/parsing/other-languages/basic/commodore-basic/scanning/scanToQBasicTokens.js';

export function testScanToQBasicTokens(logger) {
	const cases = [
		{
			'code': 'print 10',
			'tokens': ['print', '10']
		},
		{
			'code': 'print “hi”',
			'tokens': ['print', '"hi"']
		},
		{
			'code': '40 poke53280',
			'tokens': ['40', 'poke', '53280']
		},
		{
			'code': `GOTO130
130 print`,
			'tokens': ['GOTO', '130', '130', 'print']
		}
	];
	processTokenSanitizersTestCases(cases, scanToQBasicTokens, logger);
};