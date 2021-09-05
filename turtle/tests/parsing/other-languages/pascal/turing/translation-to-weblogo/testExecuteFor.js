import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteFor(logger) {
	const cases = [
		{
			'code': `for i:1..3
	put i
end for`, 'messages': ['1', '2', '3']
		},
		{
			'code': `for i:1..5 by 2
	put i
end for`, 'messages': ['1', '3', '5']
		},
		{
			'code': `for i:5..1 by -2
	put i
end for`, 'messages': ['5', '3', '1']
		},
		{
			'code': `for decreasing i:5..1 by 2
	put i
end for`, 'messages': ['5', '3', '1']
		},
		{
			'code': `for decreasing i:3..1
	put i
end for`, 'messages': ['3', '2', '1']
		}
	];
	processTranslateExecuteCases(cases, logger);
};