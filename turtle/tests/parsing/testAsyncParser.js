import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { AsyncParser } from '../../modules/parsing/AsyncParser.js';
import { CachedParseTree } from '../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { compareTrees } from '../helpers/parsing/compareTrees.js';
import { delay } from '../../modules/delay.js';
import { getCachedParseTreeFromCode } from '../helpers/getCachedParseTreeFromCode.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { noop } from '../../modules/noop.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
await ParseTreeToken.asyncInit();

async function simulateRapidCodeEditing(logger) {
	const proceduresMap = new Map();
	const parser = new AsyncParser();
	const code = 'fd 100';
	const delayIntervalChange = 5;
	let delayInterval = 0;
	let numberResolved = 0, numberRejected=0;
	for (let i = 0; i < code.length; i++) {
		const newCode = code.substring(0, i);
		const plogger = prefixWrapper(`code=${newCode}`, logger);
		/*
		When newCode='fd' or 'fd ', logged parse messages are expected.
		To avoid noise from those errors, we'll use noop to ignore any parse errors or warnings.
		*/
		const tplogger = new TestParseLogger(noop, newCode);
		await delay(delayInterval += delayIntervalChange);
		const promise = parser.parse(newCode, tplogger, proceduresMap);
		promise.then(function() {
			numberResolved++;
		}).catch(function(problemDetails) {
			numberRejected++;
			if (problemDetails !== 'cancel')
				logger(`The only expected reason to reject is to cancel a concurrently processed AsyncParseTask but ran into this problem: ${problemDetails}`);
		});
	}
	const maxTimeout = 10000;
	setTimeout(function() {
		if (numberResolved + numberRejected !== code.length) {
			logger(`After a timeout of ${maxTimeout}ms, expected ${code.length} rejected and resolved parse tasks but got ${numberResolved + numberRejected}`);
		}
	}, maxTimeout);
}

function testWithCode(code, numProcs, logger) {
	const parser = new AsyncParser();
	const tplogger = new TestParseLogger(logger, code);
	const proceduresMap = new Map();
	const promise = parser.parse(code, tplogger, proceduresMap);
	if (!(promise instanceof Promise))
		logger(`return value from parse expected to be a Promise but got ${promise}`);
	else {
		return new Promise(function(resolve, reject) {
			promise.then(function(result) {
				if (!(result instanceof ParseTreeToken)) {
					logger(`parse result expected to resolve to a ParseTreeToken but got ${result}`);
					reject();
				}
				else if (result.type !== ParseTreeTokenType.TREE_ROOT) {
					logger(`parse result.type expected to be TREE_ROOT but got ${ParseTreeTokenType.getNameFor(result.type)}`);
					reject();
				}
				else {
					const proceduresMap = getProceduresMap(result);
					if (proceduresMap.size !== numProcs)
						logger(`Expected proceduresMap size to be ${numProcs} but got ${proceduresMap.size}`);
					analyzeCodeQuality(result, tplogger, proceduresMap, new Map());
					const cachedTree = new CachedParseTree(result, proceduresMap, new Map());
					resolve(cachedTree);
				}
			}).catch(function(details) {
				console.error('error: ' + details);
				logger('error: ' + details);
				reject();
			});
		});
	}
}

function testSingle(logger) {
	testWithCode('fd 30', 0, logger);
}

function testWithLocalMake(logger) {
	const code = `to p
	localmake "oldPos pos
	setPos :oldPos;
	end`;
	const syncTree = getCachedParseTreeFromCode(code, logger);
	const syncOldPos = syncTree.getVariables().getVariableByName('oldpos');
	if (syncOldPos === undefined || syncOldPos.scopes.length !== 1)
		logger(`Expected cached parse tree created syncronously to have an oldpos variable with 1 scope but syncOldPos = ${syncOldPos}`);

	testWithCode(code, 1, logger).then(function(cacheTree) {
		compareTrees(syncTree.root, cacheTree.root, logger);
		const pProcedure = cacheTree.getProcedureByName('p');
		if (pProcedure === undefined)
			logger('Expected to get a procedure named p but got undefined');
	});
}

export function testAsyncParser(logger) {
	simulateRapidCodeEditing(prefixWrapper('simulateRapidCodeEditing', logger));
	testSingle(prefixWrapper('testSingle', logger));
	testWithLocalMake(prefixWrapper('testWithLocalMake', logger));
};