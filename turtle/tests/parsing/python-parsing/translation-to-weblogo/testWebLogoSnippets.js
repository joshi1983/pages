import { analyzeCodeQuality } from
'../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from '../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { fetchText } from '../../../../modules/fetchText.js';
import { filenames } from '../../../../modules/parsing/python-parsing/translation-to-weblogo/tokenToWebLogoCode.js';
import { getCachedParseTreeFromCode } from
'../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { StringBuffer } from '../../../../modules/StringBuffer.js';

const content = new StringBuffer();
const snippetFilenames = [];
for (let i = 0; i < filenames.length; i++) {
	const fileNamePair = filenames[i];
	const filename = fileNamePair[0];
	snippetFilenames.push(filename);
	content.append(await fetchText('logo-scripts/python-turtle-content/' + filename));
	content.append('\n');
}
export function testWebLogoSnippets(logger) {
	const code = content.toString();
	const tree = getCachedParseTreeFromCode(code, logger);
	const parseLogger = new BufferedParseLogger();
	const proceduresMap = tree.getProceduresMap();
	const initialVariablesMap = new Map();
	analyzeCodeQuality(tree.root, parseLogger, proceduresMap,
		initialVariablesMap, false);
	if (parseLogger.hasLoggedErrorsOrWarnings()) {
		logger(`Not expected any errors or warnings but got some.  Messages were: ${
			parseLogger._messages.map(m => m.msg)}, code = ${code}`);
	}
};