import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { scan } from
'../../../../modules/parsing/python-parsing/scanning/scan.js';

// Scans all examples to see if any of them
// throw an unwanted error or freeze.
export function testScanExamples(logger) {
	pythonTurtleExampleFilesContent.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = scan(code);
		if (!(result instanceof Array))
			plogger(`Expected scan to always return an Array but found ${result}`);
	});
};