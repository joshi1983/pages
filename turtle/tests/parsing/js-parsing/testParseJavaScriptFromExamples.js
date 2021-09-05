import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { compile } from '../../../modules/parsing/compile.js';
import { JavaScriptInstruction } from '../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { processParseTestCases } from './processParseTestCases.js';
import { ScriptExampleDisplayRepository } from '../../../modules/file/file-load-example/ScriptExampleDisplayRepository.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';
await ZippedExamples.asyncInit();

const compileOptions = {
	'forProduction': true,
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true
};

function getJavaScriptInstructionsFromInstructionsArray(instructions) {
	return instructions.filter(i => i instanceof JavaScriptInstruction);
}

function getAllJSInstructions(program) {
	const result = getJavaScriptInstructionsFromInstructionsArray(program.instructions);
	// loop through procedures.
	for (const [name, proc] of program.procedures) {
		ArrayUtils.pushAll(result, getJavaScriptInstructionsFromInstructionsArray(proc.instructions));
	}
	return result;
}

function jsInstructionToCaseInfo(jsInstruction) {
	return {'code': jsInstruction.code};
}

export async function testParseJavaScriptFromExamples(logger) {
	const cases = [];
	const indicator = new ProgressIndicator('testParseJavaScriptFromExamples');
	logger.indicators.push(indicator);
	indicator.setMessage('Waiting for all trees to be available');
	const allDisplaysMap = await ScriptExampleDisplayRepository.allTreesAvailable();
	indicator.setMessage('All trees available');
	if (!(allDisplaysMap instanceof Map))
		logger(`Expected to resolve to a Map but found ${allDisplaysMap}`);
	let i = 0;
	for (const [url, display] of allDisplaysMap) {
		const proceduresMap = new Map();
		const code = ZippedExamples.getContentForFilename(display.url);
		if (typeof code !== 'string') {
			indicator.setMessage(`Failed because a non-string code was found at url ${url}`);
			indicator.completed();
			throw new Error(`display.code expected to be a string but got ${code}. url=${url}`);
		}
		const parseLogger = new TestParseLogger(logger, code);
		display.parsePromise.then(function() {
			const program = compile(code, display.tree, parseLogger, new Map(),
				compileOptions, proceduresMap);
			const jsInstructions = getAllJSInstructions(program);
			ArrayUtils.pushAll(cases, jsInstructions.map(jsInstructionToCaseInfo));
			i++;
			indicator.setProgressRatio(i / allDisplaysMap.size);
			indicator.setMessage(`Processed ${url} ${i} of ${allDisplaysMap.size}`);
		});
	}
	indicator.completed();
	processParseTestCases(cases, logger);
	console.log(`processed all js from examples.`);
};