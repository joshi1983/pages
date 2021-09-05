import { analyzeCodeQuality } from
'../../../../modules/parsing/parse-tree-anlysis/validation/analyzeQuality.js';
import { fixCode } from
'../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { kturtleExampleFiles } from '../../../helpers/parsing/kturtleExampleFiles.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testTranslateVariousExamples(logger) {
	// loop through the examples.
	kturtleExampleFiles.forEach(function(kturtleCode, index) {
		const plogger = prefixWrapper(`Case ${index}, KTurtle code = ${kturtleCode}`, logger);
		let translatedCode = translate(kturtleCode);
		const translatedParseLogger = new TestParseLogger(plogger, translatedCode);
		const translatedTree = LogoParser.getParseTree(translatedCode, translatedParseLogger);
		const translatedProceduresMap = getProceduresMap(translatedTree);
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
		analyzeCodeQuality(finalResult, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram);
	});
};