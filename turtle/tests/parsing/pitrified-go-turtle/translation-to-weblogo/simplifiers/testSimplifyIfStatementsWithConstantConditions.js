import { processSimplifierCases } from './processSimplifierCases.js';
import { simplifyIfStatementsWithConstantConditions } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/simplifyIfStatementsWithConstantConditions.js';

export function testSimplifyIfStatementsWithConstantConditions(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'if x {\n}', 'changed': false},
		{'code': 'if false {}', 'to': ''},
		{'code': 'if false {fmt.Println("hi")}', 'to': ''},
		{'code': 'if true {}', 'to': ''},
		{'code': 'if true {fmt.Println("hi")}', 'to': 'fmt.Println("hi")'},
	];
	processSimplifierCases(cases, simplifyIfStatementsWithConstantConditions, logger);
};