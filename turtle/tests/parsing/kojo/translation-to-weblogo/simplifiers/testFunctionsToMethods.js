import { functionsToMethods } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/functionsToMethods.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testFunctionsToMethods(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'println("hi")', 'changed': false},
		{'code': 'val x = 3', 'changed': false},
		{'code': 'val x: Int = 3', 'changed': false},
		{'code': 'val add = (x: Int, y: Int) => x + y',
		'to': `def add(x: Int,y: Int) {
return x + y
}`},
	];
	processSimplifierCases(cases, functionsToMethods, logger);
};