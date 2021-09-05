import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { simplify } from
'../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/simplify.js';
import { TestParseLogger } from
'../../../helpers/TestParseLogger.js';
import { validateTokensByType } from
'../../../../modules/parsing/kojo/parsing/parse-tree-analysis/validation/validateTokensByType.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

const examples = kojoExamples.slice();

function testValidExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const parseResult = parse(code);
			if (typeof parseResult !== 'object')
				plogger(`Expected an object but found ${parseResult}`);
			else {
				const parseLogger = new TestParseLogger(plogger, code);
				simplify(parseResult.root);
				validateTokensByType(parseResult.root, parseLogger);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Error or exception thrown.  e=${exceptionToString(e)}`);
		}
	});
}

export function testParseVariousExamples(logger) {
	wrapAndCall([
		testValidExamples
	], logger);
};