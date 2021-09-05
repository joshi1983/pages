import { ScriptExampleExecutionScheduler } from '../../../modules/file/file-load-example/ScriptExampleExecutionScheduler.js';

export function testScriptExampleExecutionScheduler(logger) {
	ScriptExampleExecutionScheduler.stop();
	ScriptExampleExecutionScheduler.refreshPriorities([]);
	ScriptExampleExecutionScheduler.refreshPriorities([{
		'filename': 'simple/house.lgo'
	}]);
	ScriptExampleExecutionScheduler.stop();
	ScriptExampleExecutionScheduler._executeChunk();
};