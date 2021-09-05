import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../helpers/parsing/qbasicExamples.js';
import { scan } from
'../../../../modules/parsing/qbasic/scanning/scan.js';

export function testScanAllQBasicExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tokens = scan(content);
		if (!(tokens instanceof Array))
			plogger(`Expected scan to return an Array but found ${tokens}`);
	});
};