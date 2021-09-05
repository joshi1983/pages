import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
await LogoScanner.asyncInit();

export function testGetTokensForParsing(logger) {
	const cases = [
		{'code': 'fd 100', 'numTokens': 2},
		{'code': 'fd ~\n100', 'numTokens': 2},
		{
			// naming a procedure the same as a command is a problem but
			// it shouldn't affect things at this stage.
			'code': 'to fd\nend', 
			'numTokens': 4
		},
		{'code': '\'hello\nend', 'numTokens': 1},
	];
	cases.forEach(function(caseInfo) {
		const tokens = LogoScanner.getTokensForParsing(caseInfo.code);
		if (caseInfo.numTokens !== tokens.length) {
			logger('Expected ' + caseInfo.numTokens + ' tokens but got ' + tokens.length + ' for code: ' + caseInfo.code);
		}
	});
};