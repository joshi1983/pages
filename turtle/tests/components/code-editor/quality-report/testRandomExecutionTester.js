import { compileOptionsArray } from
'../../../parsing/execution/compileOptionsArray.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { RandomExecutionTester } from
'../../../../modules/components/code-editor/quality-report/RandomExecutionTester.js';
import { testCodeToProgram } from
'../../../helpers/testCodeToProgram.js';

const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];

function testCode(code, logger) {
	const program = testCodeToProgram(code, logger, compileOptions, true);
	const tester = new RandomExecutionTester(program);
	tester.addEventListener('failure', function(failureEvent) {
	});
	tester.start();
	setTimeout(function() {
		tester.stop();
		tester.dispose();
	}, 10000);
}

export function testRandomExecutionTester(logger) {
	const cases = [
	'',
	`fd animation.time
print random 100`,
	`to animation.setup
	localmake "result createPList
	setProperty "result "duration 10
	output :result
end`,
	];
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		testCode(code, plogger);
	});
};