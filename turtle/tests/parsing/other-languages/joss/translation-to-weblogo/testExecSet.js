import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecSet(logger) {
	const cases = [
		{'code': `Set x=3
Type x`, 'messages': ['3']},
		{'code': `Set x=3
Type x.`, 'messages': ['3']},
		{'code': `Set x=3,y=5.
Type x.
Type y.`, 'messages': ['3', '5']},
	];
	processTranslateExecuteCases(cases, logger);
};