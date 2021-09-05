import { processCompileTestCases } from './processCompileTestCases.js';

export function testCompileBreakStatement(logger) {
	const cases = [
		{
			'code': `repeat 2 [
	make "z 0
	if :z < 1 [
		break
	]
	for ["x 0 2] [
	]
]`,
			'numProcedures': 0,
			'instructionsDTO': [
				// index 0
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push-max-repcount'},

				// index 2
				{'name': 'push', 'value': 'z', 'isCloningValue': false},
				{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2, 'skipValidationAndSanitization': false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'z'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '>='},
				{'name': 'jump-if-true', 'newIndex': 11},

				// index 10
				{'name': 'jump', 'newIndex': 21},
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},

				// index 15
				{'name': 'push-for-count'},
				{'name': 'increment-for-counter'},
				{'name': 'jump-if-true', 'newIndex': 16},
				{'name': 'pop-for-count'},

				// index 19
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 2},
				
				// index 21
				{'name': 'pop-repcount'}
			]
		}
	];
	processCompileTestCases(cases, logger);
};