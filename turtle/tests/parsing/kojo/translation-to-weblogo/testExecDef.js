import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecDef(logger) {
	const cases = [
		{'code': `def fn2(n: Int): Boolean = {
    n > 4
}

println(fn2(1))
println(fn2(5))`, 'messages': ['false', 'true']},
	];
	processTranslateExecuteCases(cases, logger);
};