import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getTokenEqualitiesFromCachedParseTree } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/getTokenEqualitiesFromCachedParseTree.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { ZippedExamples } from
'../../../../../modules/file/file-load-example/ZippedExamples.js';

await ZippedExamples.asyncInit();

export async function testGetTokenEqualitiesWithVariousExamples(logger) {
	for (const filename of ZippedExamples.getFilenames()) {
		const code = ZippedExamples.getContentForFilename(filename);
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const plogger = prefixWrapper(`Case ${filename}`, logger);
		try {
			const result = getTokenEqualitiesFromCachedParseTree(cachedParseTree);
			if (!(result instanceof Map))
				plogger(`Expected result to be a Map but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`exception while analyzing token equalities.  e=${exceptionToString(e)}`);
		}
	}
};