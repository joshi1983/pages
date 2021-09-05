import { AsyncParseTask } from '../../modules/parsing/AsyncParseTask.js';

const result = await AsyncParseTask.asyncInit();
window.isFailing = result.isFailing;
const code = 'fd 100';
const proceduresMap = new Map();
window.asyncParseTaskMessage = 'Waiting for parse to complete';
function resolve(parseResult) {
	if (typeof parseResult !== 'object') {
		window.asyncParseTaskMessage = 'Expected to resolve to object but got ' + typeof parseResult;
		window.isFailing = true;
		return;
	}
	else if (!(parseResult.messages instanceof Array)) {
		window.asyncParseTaskMessage = 'Expected to resolve to object with a messages Array but got parseResult.messages=' + parseResult.messages;
		window.isFailing = true;
		return;
	}
	window.asyncParseTaskMessage = '';
	window.isFailing = false;
}

function reject() {
	window.asyncParseTaskMessage = 'rejected';
	window.isFailing = true;
}

const priority = AsyncParseTask.LOW_PRIORITY;
const isHidingErrors = false;
new AsyncParseTask(code, proceduresMap, resolve, reject, priority, isHidingErrors);
