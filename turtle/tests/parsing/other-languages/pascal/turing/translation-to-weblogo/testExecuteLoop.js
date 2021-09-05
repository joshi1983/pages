import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteLoop(logger) {
	const cases = [
		{
			'code': `var i : int := 1
loop
	put i
	exit when i > 2
	
	i += 1
end loop`, 'messages': ['1', '2', '3']
		},
	];
	processTranslateExecuteCases(cases, logger);
};