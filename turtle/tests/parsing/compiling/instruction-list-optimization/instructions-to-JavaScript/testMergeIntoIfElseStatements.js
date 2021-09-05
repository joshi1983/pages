import { mergeIntoIfElseStatements } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/mergeIntoIfElseStatements.js';
import { processIfMergeTestCases } from './processIfMergeTestCases.js';

export function testMergeIntoIfElseStatements(logger) {
	const cases = [
	{// do nothing for simple if-statements.
		'instructionsDTO': [
			{'name': 'push', 'value': true, 'isCloningValue': false},
			{'name': 'jump-if-true', 'newIndex': 3},
			{'name': 'javascript', 'code': 'context.turtle.forward(100)'}
		],
		'afterLength': 3,
		'codeIndex': 2,
		'expectedCode': 'context.turtle.forward(100)'
	},
	{
		'instructionsDTO': [
			{'name': 'push', 'value': true, 'isCloningValue': false},
			{'name': 'jump-if-true', 'newIndex': 4},
			{'name': 'javascript', 'code': 'context.turtle.print("hi")'},
			{'name': 'jump', 'newIndex': 5},
			{'name': 'javascript', 'code': 'context.turtle.print("bye")'},
		],
		'afterLength': 1,
		'codeIndex': 0,
		'expectedCode': 'if (!true) {\ncontext.turtle.print("bye");\n} else {\ncontext.turtle.print("hi");\n}'
	}
	];
	processIfMergeTestCases(cases, mergeIntoIfElseStatements, logger);
};