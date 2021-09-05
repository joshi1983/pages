import { processFixerCases } from './processFixerCases.js';
import { simplifyPiVariables } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/simplifyPiVariables.js';

export function testSimplifyPiVariables(logger) {
	const cases = [
		{'code': '', 'to': ''},
		{'code': 'const x = 3.14159265\nprint x', 'changed': false},
		{'code': 'const pi = 10\nprint pi', 'changed': false},
		{'code': 'dim pi = 10\nprint pi', 'changed': false},
		{'code': 'let pi = 10\nprint pi', 'changed': false},
		{'code': 'pi = 10\nprint pi', 'changed': false},
		{'code': 'sub p(pi)\nend sub', 'changed': false},
		{'code': 'sub p(pi)\nprint pi\nend sub', 'changed': false},
		{'code': 'sub p(pi)\npi = 10\nprint pi\nend sub', 'changed': false},
		{'code': 'function p(pi)\nend function', 'changed': false},
		{'code': 'const pi = 3.14156', 'to': ''},
		{'code': 'dim pi = 3.14156', 'to': ''},
		{'code': 'let pi = 3.14156', 'to': ''},
		{'code': 'pi = 3.14156', 'to': ''},
		{'code': 'const pi = 3.14156\nprint pi', 'to': 'print _PI'},
		{'code': 'let pi = 3.14156\nprint pi', 'to': 'print _PI'},
		{'code': 'dim pi = 3.14156\nprint pi', 'to': 'print _PI'},
		{'code': 'pi = 3.14156\nprint pi', 'to': 'print _PI'}
	];
	processFixerCases(cases, simplifyPiVariables, logger);
};