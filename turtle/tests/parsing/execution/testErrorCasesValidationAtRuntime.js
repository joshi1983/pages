import { analyzeCodeQuality } from '../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { compile } from '../../../modules/parsing/compile.js';
import { createPrintCountTestTurtle } from '../../helpers/parsing/createPrintCountTestTurtle.js';
import { getProceduresMap } from '../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { LogoRuntimeException } from '../../../modules/parsing/execution/LogoRuntimeException.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
await LogoParser.asyncInit();

const compileOptionsArray = [
	{
		'translateToJavaScript': false,
		'expectErrorCasesError': true
	},
	{'translateToJavaScript': true,
		'expectErrorCasesError': true
	},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'expectErrorCasesError': true
	},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'forProduction': true,
		'expectErrorCasesError': false
	},
	{
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': false,
		'forProduction': true,
		'expectErrorCasesError': false
	}
];

function isErrorCasesCheckValidationException(e) {
	if (!(e instanceof LogoRuntimeException))
		return false;
	if (e.message.indexOf('Parameter radius in command circle') !== 0)
		return false;
	return true;
}

export function testErrorCasesValidationAtRuntime(logger) {
	const code = 'to p :size\ncircle :size\nend\np 0';
	const testLogger = new TestParseLogger(logger, code, false);
	const tree = LogoParser.getParseTree(code, testLogger);
	if (testLogger.hasLoggedErrors())
		logger('Unexpectedly logged errors while parsing ' + code +
			'.  Unable to compile or execute because of the failed parse.');
	else {
		const proceduresMap = getProceduresMap(tree);
		analyzeCodeQuality(tree, testLogger, proceduresMap, new Map());
		if (testLogger.hasLoggedErrors())
			logger('Code quality analysis unexpectedly found quality problems with the parse tree so compilation and execution can not happen');
		else {
			compileOptionsArray.forEach(function(compileOptions, index) {
				const expectErrorCasesError = compileOptions.expectErrorCasesError;
				compileOptions.expectErrorCasesError = undefined;
				// to more closely match the options expected by compile.

				const program = compile(code, tree, testLogger, undefined, compileOptions, new Map());
				const prefixLogger = prefixWrapper('Failed with code ' + code + ', compile options index ' +
					index + ', compileOptions: ' + JSON.stringify(compileOptions), logger);
					// no need to continue testing with these compile options because error already found.
				let turtleInfo = createPrintCountTestTurtle();
				const executer = new LogoProgramExecuter(turtleInfo.turtle, program);
				let exceptionThrown = false;
				executer.addEventListener('exception', function(e) {
					exceptionThrown = true;
					if (expectErrorCasesError !== isErrorCasesCheckValidationException(e.details.e)) {
						console.error(e);
						if (expectErrorCasesError === true)
							prefixLogger(`Expected errorCases error but got a different kind of exception.  message=${e.details.e.message}`);
						else {
							prefixLogger(`exception thrown. e=${e.details.e.message}`);
						}
					}
				});
				executer.executeInstructionsSync(1000);
				if (expectErrorCasesError === true) {
					if (exceptionThrown !== true)
						prefixLogger(`Expected exception ${exceptionThrown}`);
				}
			});
		}
	}
};