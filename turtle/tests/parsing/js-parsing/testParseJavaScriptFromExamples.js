import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { compile } from '../../../modules/parsing/compile.js';
import { JavaScriptInstruction } from '../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { processParseTestCases } from './processParseTestCases.js';
import { ScriptExampleDisplayRepository } from '../../../modules/file/file-load-example/ScriptExampleDisplayRepository.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

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
	const allDisplaysMap = await ScriptExampleDisplayRepository.allTreesAvailable();
	if (!(allDisplaysMap instanceof Map))
		logger(`Expected to resolve to a Map but found ${allDisplaysMap}`);
	for (const [url, display] of allDisplaysMap) {
		const proceduresMap = new Map();
		const parseLogger = new TestParseLogger(logger, display.code);
		const program = compile(display.code, display.cachedParseTree.root, parseLogger, new Map(),
			compileOptions, proceduresMap);
		const jsInstructions = getAllJSInstructions(program);
		ArrayUtils.pushAll(cases, jsInstructions.map(jsInstructionToCaseInfo));
	}
	processParseTestCases(cases, logger);
	console.log(`processed all js from examples.`);
};