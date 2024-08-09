import { mergeIntoIfStatements } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/mergeIntoIfStatements.js';
import { processIfMergeTestCases } from './processIfMergeTestCases.js';

export function testMergeIntoIfStatements(logger) {
	const cases = [
	/*{
		'instructionsDTO': [
			{'name': 'push', 'value': true, 'isCloningValue': false},
			{'name': 'jump-if-true', 'newIndex': 3},
			{'name': 'javascript', 'code': 'context.turtle.forward(100)'}
		],
		'afterLength': 1,
		'codeIndex': 0,
		'expectedCode': 'if (true) {\ncontext.turtle.forward(100);\n}'
	},
	{
		'instructionsDTO': [
			{'name': 'javascript', 'code': 'context.turtle.forward(9876)'},
			{'name': 'push', 'value': true, 'isCloningValue': false},
			{'name': 'jump-if-true', 'newIndex': 4},
			{'name': 'javascript', 'code': 'context.turtle.forward(100)'},
			{'name': 'javascript', 'code': 'context.turtle.forward(123)'}
		],
		'afterLength': 3,
		'codeIndex': 1,
		'expectedCode': 'if (true) {\ncontext.turtle.forward(100);\n}'
	},
	{
		'instructionsDTO': [
			{'name': 'javascript',
			'code': `context.make("animationratio",1);
	context.valueStack.push( context.readVariable("animationratio") <= 0.5);`},
			{'name': 'jump-if-true', 'newIndex': 3},
			{'name': 'javascript', 'code': 'context.make("animationratio",1 - context.readVariable("animationratio") );'},
			{'name': 'javascript', 'code': `let animationratio = context.readVariable("animationratio");
	animationratio= animationratio * 2 ;
	context.turtle.print(animationratio );
	context.make("animationratio", animationratio);`}
		],
		'expectedCode': `if (!(context.readVariable("animationratio") <= 0.5)) {
context.make("animationratio",1 - context.readVariable("animationratio") );
}`,
		'codeIndex': 1,
		'afterLength': 3
	},
	{
		'instructionsDTO': [
			{'name': 'javascript',
			'code': 'context.valueStack.push(true)'},
			{'name': 'jump-if-true', 'newIndex': 3},
			{'name': 'javascript', 'code': 'context.make("animationratio",1 - context.readVariable("animationratio") );'},
			{'name': 'javascript', 'code': 'context.turtle.forward(123)'}
		],
		'expectedCode': `if (!true) {
context.make("animationratio",1 - context.readVariable("animationratio") );
}`,
		'codeIndex': 0,
		'afterLength': 2
	},*/
	{
		'instructionsDTO': [
			{'name': 'javascript', 
			'code': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");
context.valueStack.push(!( result < 0 || localVariables.get("d") < result ))`},
			{'name': 'jump-if-true', 'newIndex': 3},
			{'name': 'javascript', 'code': 'context.localmake("result",context.getCurrentExecutingProcedure().localVariables.get("d"))'},
			{'name': 'javascript', 'code': 'context.valueStack.push(context.readVariable("result"))'}
		],
		'expectedCode': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let result = localVariables.get("result");
let d = localVariables.get("d");
if (result < 0 || d < result) {
	result = d;
}`,
		'codeIndex': 0,
		'afterLength': 1
	}
	];
	processIfMergeTestCases(cases, mergeIntoIfStatements, logger);
};