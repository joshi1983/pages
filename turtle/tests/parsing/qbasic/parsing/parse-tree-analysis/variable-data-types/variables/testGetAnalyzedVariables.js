import { exceptionToString } from
'../../../../../../../modules/exceptionToString.js';
import { getAnalyzedVariables } from
'../../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/variables/getAnalyzedVariables.js';
import { parse } from
'../../../../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../../../helpers/parsing/qbasicExamples.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

function runOnAllExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		try {
			const parseResult = parse(content);
			const result = getAnalyzedVariables(parseResult.root);
			if (!(result instanceof Map)) {
				plogger(`Expected a Map but found ${result}`);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Failed with error. e=${exceptionToString(e)}`);
		}
	});
}

export function testGetAnalyzedVariables(logger) {
	wrapAndCall([
		runOnAllExamples
	], logger);
};