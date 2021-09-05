import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteDoWhile(logger) {
	const cases = [
	{
'code': `n = 1
DO
    PRINT n
    n = n + 1
LOOP WHILE n <= 2`,
	'messages': ['1', '2']
	},
	{
'code': `n = 1
DO
    PRINT n
    n = n + 1
LOOP WHILE n < 0`,
	'messages': ['1']
	}
	];
	processTranslateExecuteCases(cases, logger);
};