import { analyzeCodeQuality } from
'../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { fixCode } from
'../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { kturtleExampleFiles } from '../../../helpers/parsing/kturtleExampleFiles.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { translate } from '../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';

export function testTranslateVariousExamples(logger) {
	// loop through the examples.
	kturtleExampleFiles.forEach(function(kturtleCode, index) {
		const plogger = prefixWrapper(`Case ${index}, KTurtle code = ${kturtleCode}`, logger);
		let translatedCode = translate(kturtleCode);
		const translatedParseLogger = new TestParseLogger(plogger, translatedCode);
		const translatedTree = LogoParser.getParseTree(translatedCode, translatedParseLogger);
		const translatedProceduresMap = getProceduresMap(translatedTree);
		const fixParseLogger = new ParseLogger(); // ignore the messages.
		const fixLogger = new FixLogger(fixParseLogger);
		fixCode(translatedCode, fixLogger, translatedProceduresMap, translatedTree);
		const finalResult = harmonizeCase(translatedCode);
		const parseLogger = new TestParseLogger(plogger, finalResult);
		const finalTree = LogoParser.getParseTree(finalResult, parseLogger, new Map());
		if (finalTree === undefined) {
			plogger(`Parsing the final WebLogo code failed so we won't run analyzeCodeQuality.`);
			return;
		}
		const proceduresMap = getProceduresMap(finalTree);
		const initialVariablesMap = new Map();
		const isCompleteProgram = true;
		analyzeCodeQuality(finalTree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram);
	});
};