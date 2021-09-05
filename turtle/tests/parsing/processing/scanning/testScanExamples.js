import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { scan } from '../../../../modules/parsing/processing/scanning/scan.js';

export function testScanExamples(logger) {
	processingExamples.forEach(function(exampleCode, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${exampleCode}`, logger);
		const result = scan(exampleCode);
		if (!(result instanceof Array))
			plogger(`Expected result to be an Array but got something else`);
	});
};