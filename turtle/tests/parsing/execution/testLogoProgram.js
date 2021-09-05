import { compileOptionsArray } from './compileOptionsArray.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';

function testUsesAsyncInstructions(logger) {
	const cases = [
		{'code': '', 'out': false},
		{'code': 'fd 100', 'out': false},
		{'code': 'to p\nend', 'out': false},
		{'code': 'to p\nfd 100\nend', 'out': false},
		{'code': 'make "x readJson \'local://test.json\'', 'out': true},
		{'code': 'to p\nmake "x readJson \'local://test.json\'\nend', 'out': true}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		compileOptionsArray.forEach(function(compileOptions) {
			const program = testCodeToProgram(caseInfo.code, plogger, compileOptions, false);
			const result = program.usesAsyncInstructions();
			if (result !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		});
	});
}

export function testLogoProgram(logger) {
	testUsesAsyncInstructions(prefixWrapper('testUsesAsyncInstructions', logger));
};