import { analyzeCodeQuality } from
'../../../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { getProceduresMap } from
'../../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../../../../helpers/TestParseLogger.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';

export function testTranslateExamples(logger) {
	codeHeartTurtleScriptExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		const webLogoContent = translateToWebLogo(content);
		if (typeof webLogoContent !== 'string') {
			plogger(`Expected a string but got ${webLogoContent}`);
		}
		else {
			const parseLogger = new TestParseLogger(plogger, webLogoContent);
			const tree = LogoParser.getParseTree(webLogoContent, parseLogger);
			if (tree === undefined) {
				plogger(`Parsing failed unexpectedly`);
				return;
			}
			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = new Map();
			analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, {
				'isCompleteProgram': true
			});
		}
	});
};