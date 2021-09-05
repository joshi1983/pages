import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecRepeat(logger) {
	const cases = [
		{'code': `repeat(2) {
println("hi")
}`, 'messages': ['hi', 'hi']},
	];
	processTranslateExecuteCases(cases, logger);
};