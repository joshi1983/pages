import { analyzeCodeQuality } from '../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { compile } from '../../../modules/parsing/compile.js';
import { getProceduresMap } from '../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { Turtle } from '../../../modules/command-groups/Turtle.js';
import { validateProgram } from '../../helpers/parsing/validateProgram.js';
import { Vector2DDrawing } from '../../../modules/drawing/vector/Vector2DDrawing.js';

const compileOptionsArray = [
	{'translateToJavaScript': false},
	{'translateToJavaScript': true},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true
	},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'forProduction': true
	},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': false,
		'forProduction': true
	}
];

function createPrintCountTestTurtle() {
	const settings = {
		'animationTime': 0,
		'printCount': 0,
		'messages': [],
		'warn': function(msg) {
			console.log('warning: ' + msg);
		},
		'print': function(msg) {
			settings.messages.push('' + msg);
			settings.printCount++;
		}
	};
	const drawing = new Vector2DDrawing();
	drawing.setDimensions(100, 100);
	const turtle = new Turtle(settings, drawing);
	return {'turtle': turtle, 'settings': settings};
}

function checkMessages(executer, turtleInfo, caseInfo, logger) {
	executer.executeInstructionsSync(1000);
	let problemFound = false;
	if (turtleInfo.settings.messages.length !== caseInfo.messages.length) {
		logger('Expected to print ' + caseInfo.messages.length + ' but printed ' + turtleInfo.settings.messages.length + ' times.  The messages actually printed were: ' + JSON.stringify(turtleInfo.settings.messages));
		problemFound = true;
	}
	else if (turtleInfo.settings.messages instanceof Array) {
		for (let i = 0; i < caseInfo.messages.length; i++) {
			const expected = caseInfo.messages[i];
			const actual = turtleInfo.settings.messages[i];
			if (actual !== expected) {
				logger('Expected message ' + expected + ' but got ' + actual + '.');
				problemFound = true;
			}
		}
	}
	return problemFound;
}

export function processExecuterTestCase(caseInfo, index, logger) {
	const code = caseInfo.code;
	const plogger = prefixWrapper('Case ' + index, logger);
	const testLogger = new TestParseLogger(plogger, code, caseInfo.ignoreWarnings);
	const tree = LogoParser.getParseTree(code, testLogger);
	if (testLogger.hasLoggedErrors())
		logger('Unexpectedly logged errors while parsing ' + code + '.  Unable to compile or execute because of the failed parse.');
	else {
		const proceduresMap = getProceduresMap(tree);
		if (caseInfo.ignoreErrors === true)
			testLogger.doNotLogErrors();
		analyzeCodeQuality(tree, testLogger, proceduresMap, new Map());
		if (caseInfo.ignoreErrors !== true && testLogger.hasLoggedErrors())
			logger('Code quality analysis unexpectedly found quality problems with the parse tree so compilation and execution can not happen');
		else {
			compileOptionsArray.forEach(function(compileOptions) {
				const program = compile(code, tree, testLogger, undefined, compileOptions, new Map());
				const prefixLogger = prefixWrapper('Failed with code ' + code + ', index ' + index + ', compileOptions: ' + JSON.stringify(compileOptions), plogger);
				if (validateProgram(program, prefixLogger))
					return; // no need to continue testing with these compile options because error already found.
				let turtleInfo = createPrintCountTestTurtle();
				const executer = new LogoProgramExecuter(turtleInfo.turtle, program);
				executer.addEventListener('exception', function(e) {
					console.error(e);
					prefixLogger(`exception thrown. e=${e.details}`);
				});
				let problemFound = checkMessages(executer, turtleInfo, caseInfo, prefixLogger);
				if (!problemFound) {
					turtleInfo = createPrintCountTestTurtle();
					executer.turtle = turtleInfo.turtle;
					executer.restart();
					problemFound = checkMessages(executer, turtleInfo, caseInfo, prefixLogger);
				}
				if (problemFound) {
					prefixLogger('program instructions = ' + JSON.stringify(program.instructions.map(i => i.toDTO())));
				}
			});
		}
	}
};