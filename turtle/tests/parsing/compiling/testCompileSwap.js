import { processCompileTestCases } from './processCompileTestCases.js';

export function testCompileSwap(logger) {
	const cases = [{
		'code': 'make "x 0 make "y 1 swap "x "y',
		'numProcedures': 0,
		'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 'y', 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 'y', 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'swap', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
			]
	}];
	processCompileTestCases(cases, logger);
};