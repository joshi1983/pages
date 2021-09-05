import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testTranslateExecute(logger) {
	const cases = [
		{'code': 'import "fmt"\nfmt.Println("hello world")', 'messages': ['hello world']},
	];
	processTranslateExecuteCases(cases, logger);
};