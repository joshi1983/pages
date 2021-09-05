import { analyzeQuality } from
'../../../modules/parsing/processing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { cssExamples } from
'../../helpers/parsing/cssExamples.js';
import { kturtleExampleFiles } from
'../../helpers/parsing/kturtleExampleFiles.js';
import { parse } from
'../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { processingExamples } from
'../../helpers/parsing/processingExamples.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

const invalidExamples = [];
ArrayUtils.pushAll(invalidExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(invalidExamples, cssExamples);
ArrayUtils.pushAll(invalidExamples, kturtleExampleFiles);

function generalTests(example, logger) {
	const parseResult = parse(example);
	if (typeof parseResult !== 'object')
		logger(`Expected an object but got ${parseResult}`);
	return parseResult;
}

function testWithValidProcessingExamples(logger) {
	processingExamples.forEach(function(example, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${example}`, logger);
		const parseResult = generalTests(example, plogger);
		if (typeof parseResult === 'object') {
			if (typeof parseResult.root !== 'object')
				plogger(`Expected an object but got ${parseResult.root}`);
		}
		const parseLogger = new TestParseLogger(plogger, example);
		analyzeQuality(parseResult.root, parseLogger);
	});
}

function testWithInvalidProcessingExamples(logger) {
	invalidExamples.forEach(function(example, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${example}`, logger);
		const parseResult = generalTests(example, plogger);
		if (typeof parseResult === 'object') {
			if (typeof parseResult.root !== 'object')
				plogger(`Expected an object but got ${parseResult.root}`);
		}
		
	});
}

export function testParseExamples(logger) {
	wrapAndCall([
		testWithInvalidProcessingExamples,
		testWithValidProcessingExamples,
	], logger);
};