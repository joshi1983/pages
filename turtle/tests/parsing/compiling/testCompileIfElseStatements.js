import { processCompileTestCase } from './processCompileTestCase.js';

export function testCompileIfElseStatements(logger) {
	const cases = [
		{
			'code': 'to f :x\nifelse :x = 1 [output 1] [output :x*f :x - 1]\nend\nprint f 5',
			'numProcedures': 1,
			'procedures': {
				'f': {
					'parameters': ['x'],
					'instructionsDTO': [
						{'name': 'read-variable', 'variableName': 'x'},
						{'name': 'push', 'value': 1, 'isCloningValue': false},
						{'name': 'binary-operator', 'symbol': '='},
						{'name': 'jump-if-true', 'newIndex': 12},

						{'name': 'read-variable', 'variableName': 'x'},
						{'name': 'read-variable', 'variableName': 'x'},
						{'name': 'push', 'value': 1, 'isCloningValue': false},
						{'name': 'binary-operator', 'symbol': '-'},
						{'name': 'call-proc', 'procName': 'f'},
						{'name': 'binary-operator', 'symbol': '*'},
						{'name': 'output'},

						{'name': 'jump', 'newIndex': 14},
						{'name': 'push', 'value': 1, 'isCloningValue': false},
						{'name': 'output'},

						{'name': 'output-null'}
					]
				}
			},
			'instructionsDTO': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'call-proc', 'procName': 'f'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'ifelse :x < 1 [print :x] [print 2]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '<'},
				{'name': 'jump-if-true', 'newIndex': 8},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'jump', 'newIndex': 11},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'print ifelse :x < 1 :x 2',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '<'},
				{'name': 'jump-if-true', 'newIndex': 6},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'jump', 'newIndex': 7},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
			]
		},
	];
	cases.forEach(function(caseInfo, index) {
		processCompileTestCase(caseInfo, index, logger);
	});
};