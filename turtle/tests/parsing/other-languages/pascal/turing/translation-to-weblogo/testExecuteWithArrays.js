import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteWithArrays(logger) {
	const cases = [
		{
			'code': `var i : array 1..2 of int
i(1) := 123
put i(1)`, 'messages': ['123']
		},
	];
	processTranslateExecuteCases(cases, logger);
};