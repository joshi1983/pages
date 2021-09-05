import { AsyncParseTask } from '../../modules/parsing/AsyncParseTask.js';
import { compareTrees } from '../helpers/parsing/compareTrees.js';
import { getCachedParseTreeFromCode } from '../helpers/getCachedParseTreeFromCode.js';
import { noop } from '../../modules/noop.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
const status = await AsyncParseTask.asyncInit();

function testCancel(logger) {
	const proceduresMap = new Map();
	function resolve(result) {
	}
	function reject() {
	}
	const task = new AsyncParseTask('fd 50', proceduresMap, resolve, reject, AsyncParseTask.LOW_PRIORITY);
	task.cancel();
}

function testFailedParse(logger) {
	const cases = [
		'print 1)',
		'print :x + x:y'
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		new AsyncParseTask(code, new Map(), noop, noop, AsyncParseTask.LOW_PRIORITY);
	});
}

function testTreeCompareWithSync(logger) {
	const code = `to p
	end`;
	const syncTree = getCachedParseTreeFromCode(code, logger);
	const proceduresMap = new Map();
	const task = new AsyncParseTask(code, proceduresMap, function(result) {
		compareTrees(syncTree.root, result.tree, logger);
	}, function() {
		logger(`Unexpected reject`);
	}, AsyncParseTask.LOW_PRIORITY);
}

export function testAsyncParseTask(logger) {
	if (status.isFailing)
		logger(`AsyncParseTask can not work in this browser.  Results: ${JSON.stringify(status)}`);
	else {
		wrapAndCall([
			testCancel,
			testFailedParse,
			testTreeCompareWithSync
		], logger);
	}
};