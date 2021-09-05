import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecSubroutine(logger) {
	const cases = [
		{'code': `1.0 Type 3.
do part 1.`, 'messages': ['3']},
		{'code': `1.1 Type "hi".
1.2 stop.
Do part 1.`, 'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};