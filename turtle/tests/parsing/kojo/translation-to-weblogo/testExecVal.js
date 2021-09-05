import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecVal(logger) {
	const cases = [
		{'code': `val getTheAnswer = () => 42
println(getTheAnswer())`, 'messages': ['42']},
		{'code': `val x = 3
println(x)`, 'messages': ['3']},
		{'code': `val list1 = List(1, 2, 3)
val list2 = List(4, 5)
val combinedList = list1 ++ list2
println(combinedList)`, 'messages': ['[1 2 3 4 5]']}
	];
	processTranslateExecuteCases(cases, logger);
};