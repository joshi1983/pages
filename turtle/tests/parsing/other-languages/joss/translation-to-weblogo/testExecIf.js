import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecIf(logger) {
	const cases = [
		{'code': `Type "hi" if 1>0.`, 'messages': []},
		{'code': `Type "hi" if 1<0.`, 'messages': ['hi']},
	];
	processTranslateExecuteCases(cases, logger);
};