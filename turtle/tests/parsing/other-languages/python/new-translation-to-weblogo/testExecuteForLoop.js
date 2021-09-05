import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteForLoop(logger) {
	const cases = [
		{'code': 'for i in range(2):\n\tprint(i)', 'messages': ['0', '1']},
		{'code': 'for x,y in enumerate([4,5]):\n\tprint(y)', 'messages': ['4', '5']},
		{'code': 'for x,y in enumerate([4,5]):\n\tprint(x)', 'messages': ['0', '1']},
		{'code': 'for x,y in enumerate([4,5,6,7]):\n\tprint(x)', 'messages': ['0', '1', '2', '3']},
	];
	processTranslateExecuteCases(cases, logger);
};