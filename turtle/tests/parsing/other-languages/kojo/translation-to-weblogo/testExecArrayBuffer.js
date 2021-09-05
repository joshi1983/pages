import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecArrayBuffer(logger) {
	const cases = [
		{'code': `val ab = ArrayBuffer(2, 9, 3)
println(ab)`,
			'messages': ['[2 9 3]']
		},
		{'code': `val a = Array.ofDim[Int](2)
println(a)`,
			'messages': ['[0 0]']
		}
	];
	processTranslateExecuteCases(cases, logger);
};