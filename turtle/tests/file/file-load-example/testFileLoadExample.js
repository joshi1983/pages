import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testScriptExampleDisplay } from './testScriptExampleDisplay.js';
import { testScriptExampleExecutionScheduler } from './testScriptExampleExecutionScheduler.js';

export function testFileLoadExample(logger) {
	testScriptExampleDisplay(prefixWrapper('testScriptExampleDisplay', logger));
	testScriptExampleExecutionScheduler(prefixWrapper('testScriptExampleExecutionScheduler', logger));
};