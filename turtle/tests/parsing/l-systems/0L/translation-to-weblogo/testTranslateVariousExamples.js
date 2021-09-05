import { analyzeCodeQuality } from
'../../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from
'../../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { fractintExamples } from
'../../../../helpers/parsing/l-systems/fractintExamples.js';
import { getProceduresMap } from
'../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../../../helpers/TestParseLogger.js';
import { translate0LToWebLogo } from
'../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/translate0LToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

const examples = [];
// We'll test with more than the 0L examples
// because we want the translator to process
// invalid 0L code without throwing an error.
for (const dialectExamples of [cgjenningsExamples, fractintExamples, zeroLExamples]) {
	ArrayUtils.pushAll(examples, dialectExamples);
}

function testNoExceptions(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translate0LToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
}

function testOutputIsValidWebLogoCode(logger) {
	zeroLExamples.forEach(function(code, index) {
		try {
			const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
			const result = translate0LToWebLogo(code);
			const parseLogger = new TestParseLogger(plogger, code, false);
			const tree = LogoParser.getParseTree(result, parseLogger);
			if (tree === undefined)
				return;

			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = new Map();
			analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
		}
		catch (e) {
			// testNoException would handle showing the exception so we won't here.
			console.error(e);
		}
	});
}

export function testTranslateVariousExamples(logger) {
	wrapAndCall([
		testNoExceptions,
		testOutputIsValidWebLogoCode
	], logger);
};