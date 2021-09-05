import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecRepeatFor(logger) {
	/*
	These test cases were tested at:
	http://ikojo.in/sf/oR9PJ43/0
	to make sure they match how Kojo interprets the same code.
	*/
	const cases = [
		{'code': `repeatFor(1 until 3) {
  i =>
  println(i)
}`, 'messages': ['1', '2']},
		{'code': `repeatFor(1 to 3) {
  i =>
  println(i)
}`, 'messages': ['1', '2', '3']},
	];
	processTranslateExecuteCases(cases, logger);
};