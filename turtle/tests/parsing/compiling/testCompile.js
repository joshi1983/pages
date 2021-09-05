import { processCompileTestCase } from './processCompileTestCase.js';

export function testCompile(logger) {
	const cases = [
		{'code': '', 'numProcedures': 0, 'instructionsDTO': []},
		{'code': 'fd 100', 'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 100, 'isCloningValue': false}, 
				{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'print \'Hello World\'', 'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'Hello World', 'isCloningValue': false}, 
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{'code': 'make "x 10\nfd :x', 
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 10, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2, "skipValidationAndSanitization": false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'print (sum 1 2 3)',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 6, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'to something :x\nprint "hi\nend\nprint "hello',
			'numInstructions': 3,
			'numProcedures': 1,
			'procedures': {
				'something': {
					'parameters': ['x'],
					'instructionsDTO': [
						{'name': 'push', 'value': 'hi', 'isCloningValue': false},
						{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
						{'name': 'pop'},
						{'name': 'output-null'}
					]
				}
			},
			'instructionsDTO': [
				{'name': 'push', 'value': 'hello', 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'to something\nprint "hi\nend\nsomething',
			'numProcedures': 1,
			'procedures': {
				'something': {
					'parameters': [],
					'instructionsDTO': [
						{'name': 'push', 'value': 'hi', 'isCloningValue': false},
						{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
						{'name': 'pop'},
						{'name': 'output-null'}
					]
				}
			},
			'instructionsDTO': [
				{'name': 'call-proc', 'procName': 'something'},
				{'name': 'pop'}
			]
		},
		{
			'code': 'make "x 1+:y',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'read-variable', 'variableName': 'y'},
				{'name': 'binary-operator', 'symbol': '+'},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'print [1 2 3]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': [1, 2, 3], 'isCloningValue': true},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'to something\nstop\nend',
			'numProcedures': 1,
			'instructionsDTO': [
			]
		},
		{
			'code': 'setpencolor [255 255 255]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': [255, 255, 255], 'isCloningValue': true},
				{'name': 'call-cmd', 'commandName': 'setPenColor', 'numArgs': 1, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{'code': 'make "x readJson \'local://something.json\'', 'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': "x", 'isCloningValue': false}, 
				{'name': 'push', 'value': "local://something.json", 'isCloningValue': false}, 
				{'name': 'async-call-cmd', 'commandName': 'readJson', 'numArgs': 1},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2, "skipValidationAndSanitization": false},
				{'name': 'pop'}
			]
		},
		{'code': 'readJson \'local://something.json\'', 'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': "local://something.json", 'isCloningValue': false}, 
				{'name': 'async-call-cmd', 'commandName': 'readJson', 'numArgs': 1},
				{'name': 'pop'}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		processCompileTestCase(caseInfo, index, logger);
	});
};