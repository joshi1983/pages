import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testSanitizeExamples } from './testSanitizeExamples.js';
import { testScriptExampleDisplay } from './testScriptExampleDisplay.js';
import { testScriptExampleExecutionScheduler } from './testScriptExampleExecutionScheduler.js';

export function testFileLoadExample(logger) {
	testSanitizeExamples(prefixWrapper('testSanitizeExamples', logger));
	testScriptExampleDisplay(prefixWrapper('testScriptExampleDisplay', logger));
	testScriptExampleExecutionScheduler(prefixWrapper('testScriptExampleExecutionScheduler', logger));
};