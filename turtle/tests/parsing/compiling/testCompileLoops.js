import { processCompileTestCase } from './processCompileTestCase.js';

export function testCompileLoops(logger) {
	const cases = [
		{
			'code': 'repeat 4 [fd 100 right 90]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 4, 'isCloningValue': false},
				{'name': 'push-max-repcount'},
				{'name': 'push', 'value': 100, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 90, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'right', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 2},
				{'name': 'pop-repcount'}
			]
		},
		{
			'code': 'repeat 2 [repeat 2 [fd 100 right 90]]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push-max-repcount'},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push-max-repcount'},
				{'name': 'push', 'value': 100, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 90, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'right', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 4},
				{'name': 'pop-repcount'},
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 2},
				{'name': 'pop-repcount'}
			]
		},
		{
			'code': 'for ["x 1 5 2] [print :x]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push-for-count'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-for-counter'},
				{'name': 'jump-if-true', 'newIndex': 5},
				{'name': 'pop-for-count'}
			]
		},
		{
			'code': 'for ["X 1 5 2] [print :x]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'push-for-count'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-for-counter'},
				{'name': 'jump-if-true', 'newIndex': 5},
				{'name': 'pop-for-count'}
			]
		},
		{
			'code': 'while :x < 1 [print :x make "x :x + 1]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '>='},
				{'name': 'jump-if-true', 'newIndex': 14},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 'x', 'isCloningValue': false},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'jump', 'newIndex': 0}
			]
		},
		{
			'code': 'repeat 10 [ make "s repcount + 10 repeat 10 [fd :s right 36]]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 10, 'isCloningValue': false},
				{'name': 'push-max-repcount'},
				{'name': 'push', 'value': 's', 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0,"skipValidationAndSanitization":false},
				{'name': 'push', 'value': 10, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 10, 'isCloningValue': false},
				{'name': 'push-max-repcount'},
				{'name': 'read-variable', 'variableName': 's'},
				{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': 36, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'right', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 10},
				{'name': 'pop-repcount'},
				{'name': 'increment-repcount'},
				{'name': 'jump-if-true', 'newIndex': 2},
				{'name': 'pop-repcount'}
			]
		},
		{
			'code': 'repeat 360 [circle repcount]',
			'numProcedures': 0,
			'numInstructions': 8
		},
		{
			'code': 'for [ "y -200 200 1] [print :y]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 'y', 'isCloningValue': false},
				{'name': 'push', 'value': -200, 'isCloningValue': false},
				{'name': 'push', 'value': 200, 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'push-for-count'},
				{'name': 'read-variable', 'variableName': 'y'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'increment-for-counter'},
				{'name': 'jump-if-true', 'newIndex': 5},
				{'name': 'pop-for-count'}
			]
		},
		{
			'code': 'to getValue\nfor [ "i 0 255 1] [output 5]\nend\nmake "v getValue\nprint :v',
			'numProcedures': 1,
			'procedures': {
				'getvalue': {
					'parameters': [],
					'instructionsDTO': [
						{'name': 'push', 'value': 'i', 'isCloningValue': false},
						{'name': 'push', 'value': 0, 'isCloningValue': false},
						{'name': 'push', 'value': 255, 'isCloningValue': false},
						{'name': 'push', 'value': 1, 'isCloningValue': false},
						{'name': 'push-for-count'},

						{'name': 'push', 'value': 5, 'isCloningValue': false},
						{'name': 'output'},

						{'name': 'increment-for-counter'},
						{'name': 'jump-if-true', 'newIndex': 5},
						{'name': 'pop-for-count'},
						{'name': 'output-null'}
					]
				}
			},
			'instructionsDTO': [
				{'name': 'push', 'value': 'v', 'isCloningValue': false},
				{'name': 'call-proc', 'procName': 'getvalue'},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'v'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'}
			]
		},
		{
			'code': 'forever [\nprint 1\n]',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'jump', 'newIndex': 0}
			]
		},
		{
			'code': 'make "x 5\ndo.while [\nprint :x\nmake "x :x - 1\n] :x > 0',
			'numProcedures': 0,
			'instructionsDTO': [
				{'name': 'push', 'value': "x", 'isCloningValue': false},
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'push', 'value': "x", 'isCloningValue': false},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '-'},
				{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2,"skipValidationAndSanitization":false},
				{'name': 'pop'},
				{'name': 'read-variable', 'variableName': 'x'},
				{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '>'},
				{'name': 'jump-if-true', 'newIndex': 4}
			]
		},
		{
			'code': `to p
	localmake "oldPos pos
	localmake "oldHeading heading
	repeat 2 [
		localmake "offsetLen 0
		print 60
	]
end

p`,
			'numProcedures': 1,
			'instructionsDTO': [
				{'name': 'call-proc', 'procName': 'p'},
				{'name': 'pop'}
			],
			'procedures': {
				'p': {
					'parameters': [],
					'instructionsDTO': [
						{'name': 'push', 'value': 'oldpos', 'isCloningValue': false},
						{'name': 'call-cmd', 'commandName': 'pos', 'numArgs': 0,"skipValidationAndSanitization":false},
						{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2,"skipValidationAndSanitization":false},
						{'name': 'pop'}, 
						// localmake "oldPos pos

						{'name': 'push', 'value': 'oldheading', 'isCloningValue': false},
						{'name': 'call-cmd', 'commandName': 'heading', 'numArgs': 0,"skipValidationAndSanitization":false},
						{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2,"skipValidationAndSanitization":false},
						{'name': 'pop'},
						// localmake "oldHeading heading

						{'name': 'push', 'value': 2, 'isCloningValue': false},
						{'name': 'push-max-repcount'},
						// repeat 2 [

						{'name': 'push', 'value': 60, 'isCloningValue': false},
						{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1,"skipValidationAndSanitization":false},
						{'name': 'pop'},
						// print 60

						{'name': 'increment-repcount'},
						{'name': 'jump-if-true', 'newIndex': 10},
						{'name': 'pop-repcount'},
						{'name': 'output-null'}
					]
				}
			},
		}
	];
	cases.forEach(function(caseInfo, index) {
		processCompileTestCase(caseInfo, index, logger);
	});
};