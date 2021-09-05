import { analyzeCodeQuality } from
'../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { fixCode } from
'../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../modules/components/code-editor/format/formatCode.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { procedureMap } from
'../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/processPredefinedProcedures.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testPredefinedProcedureCodeQuality(logger) {
	for (const [name, content] of procedureMap) {
		// Skip the procedures that need template symbols replaced to become valid code.
		if (content.indexOf('$$$') === -1 && name === 'webTurtleTransparent') {
			const plogger = prefixWrapper(`Case name ${name}`, logger);
			const cachedParseTree = getCachedParseTreeFromCode(content, plogger);
			const parseLogger = new TestParseLogger(plogger, content);
			const proceduresMap = cachedParseTree.getProceduresMap();
			const initialVariablesMap = new Map();
			const options = {'isCompleteProgram': true};
			analyzeCodeQuality(cachedParseTree.root, parseLogger, proceduresMap, initialVariablesMap, options);

			const extraFixers = [];
			const fixLogger = new FixLogger(parseLogger);
			const fixedCode = fixCode(content, fixLogger, proceduresMap, cachedParseTree.root, extraFixers);
			const formattedContent = formatCode(fixedCode);
			const formattedTree = getCachedParseTreeFromCode(formattedContent, plogger);
			const formattedParseLogger = new TestParseLogger(plogger, formattedContent);
			analyzeCodeQuality(formattedTree.root, formattedParseLogger, proceduresMap, initialVariablesMap, options);
		}
	}
};