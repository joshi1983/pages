import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecIf(logger) {
	const cases = [
		{'code': `if (true) {
	println(1)
}`, 'messages': ['1']},
		{'code': `if (false) {
	println(1)
}`, 'messages': []},
		{'code': `if (false) {
	println(1)
} else {
	println("hi")
}`, 'messages': ['hi']},
		{'code': `if (true) {
	println(1)
} else {
	println("hi")
}`, 'messages': ['1']},
		{'code': `if (true) {
	println(1)
} else if (true) {
	println("hi")
}`, 'messages': ['1']},
		{'code': `if (false) {
	println(1)
} else if (true) {
	println("hi")
}`, 'messages': ['hi']},
		{'code': 'println(if (-1 < 0) "hi" else "bye")',
		'messages': ['hi']},
		{'code': 'println(if (1 < 0) "hi" else "bye")',
		'messages': ['bye']},
	];
	processTranslateExecuteCases(cases, logger);
};