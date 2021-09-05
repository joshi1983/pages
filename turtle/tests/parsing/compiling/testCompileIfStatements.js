import { processCompileTestCase } from './processCompileTestCase.js';

export function testCompileIfStatements(logger) {
	const cases = [
		{
			'code': 'make "x 0 if :x < 1 [print :x]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '>='},
				{'name': 'jump-if-true', 'newIndex': 11},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'to fS :size\nif :size > 2 [\nFS :size * 0.5]\nend',
			'numProcedures': 1,
			'instructionsDTO': [],
			'procedures': {
				'fs': {
					'parameters': ['size'],
					'instructionsDTO': [
						{'name': 'read-variable', 'variableName': 'size'},
						{'name': 'push', 'value': 2, 'isCloningValue': false},
						{'name': 'binary-operator', 'symbol': '<='},
						{'name': 'jump-if-true', 'newIndex': 9},

						{'name': 'read-variable', 'variableName': 'size'},
						{'name': 'push', 'value': 0.5, 'isCloningValue': false},
						{'name': 'binary-operator', 'symbol': '*'},
						{'name': 'call-proc', 'procName': 'fs'},
						{'name': 'pop'},

						{'name': 'output-null'}
					]
				}
			}
		},
	];
	cases.forEach(function(caseInfo, index) {
		processCompileTestCase(caseInfo, index, logger);
	});
};