import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecFor(logger) {
	const cases = [
		{'code': `for (i <- 1 to 2) {
println("hi")
}`, 'messages': ['hi', 'hi']},
		{'code': `for (i <- 1 to 2) {
println(i)
}`, 'messages': ['1', '2']},
	];
	processTranslateExecuteCases(cases, logger);
};