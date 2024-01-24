import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { AsyncParser } from '../../../modules/parsing/AsyncParser.js';
import { AsyncParseTask } from '../../../modules/parsing/AsyncParseTask.js';
import { compile } from '../../../modules/parsing/compile.js';
import { JavaScriptInstruction } from '../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { processParseTestCases } from './processParseTestCases.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';
await LogoParser.asyncInit();
const parser = new AsyncParser(true);

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
	indicator.setMessage('Waiting for all code to be available');
	await ZippedExamples.asyncInit();
	indicator.setMessage('All trees available');
	let i = 0;
	const filenames = ZippedExamples.getFilenames();
	for (const filename of filenames) {
		const proceduresMap = new Map();
		const code = ZippedExamples.getContentForFilename(filename);
		if (typeof code !== 'string') {
			indicator.setMessage(`Failed because a non-string code was found at filename ${filename}`);
			indicator.completed();
			throw new Error(`display.code expected to be a string but got ${code}. filename=${filename}`);
		}
		const plogger = prefixWrapper(`File: ${filename}`, logger);
		const parseLogger = new TestParseLogger(plogger, code);
		const tree = await parser.parse(code, AsyncParseTask.HIGH_PRIORITY, parseLogger, proceduresMap);
		const program = compile(code, tree, parseLogger, new Map(),
			compileOptions, proceduresMap);
		const jsInstructions = getAllJSInstructions(program);
		ArrayUtils.pushAll(cases, jsInstructions.map(jsInstructionToCaseInfo));
		i++;
		indicator.setProgressRatio(i / filenames.length);
		indicator.setMessage(`Processed ${filename} ${i} of ${filenames.length}`);
	}
	indicator.completed();
	processParseTestCases(cases, logger);
	console.log(`processed all js from examples.`);
};