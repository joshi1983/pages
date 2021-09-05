import { analyzeCodeQuality } from
'../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { getDescendentsOfType } from '../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { kturtleExampleFiles } from '../../../helpers/parsing/kturtleExampleFiles.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { MessageTypes } from '../../../../modules/components/MessageTypes.js';
import { ParseLogger } from '../../../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { translate } from '../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';

function isLoggingMessage(usesAsk) {
	return function(msg, type) {
		/*
		We can't translate ask to a similar command in WebLogo.
		This is a known problem and letting the message persist into the 
		translation is the best course of action.
		*/
		if (msg.indexOf('>ask<') !== -1)
			return false;
		if (usesAsk && msg.indexOf('command requires input of type') !== -1)
			return false;
		if (usesAsk && type === MessageTypes.TypeWarning)
			return false;
		return true;
	}
}

function callsAsk(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return code.toLowerCase().indexOf('ask') !== -1;
	return getDescendentsOfType(tree, ParseTreeTokenType.LEAF).some(t => t.val.toLowerCase() === 'ask');
}

export function testTranslateVariousExamples(logger) {
	// loop through the examples.
	kturtleExampleFiles.forEach(function(kturtleCode, index) {
		const plogger = prefixWrapper(`Case ${index}, KTurtle code = ${kturtleCode}`, logger);
		let translatedCode = translate(kturtleCode);
		const translatedParseLogger = new TestParseLogger(plogger, translatedCode);
		const translatedTree = LogoParser.getParseTree(translatedCode, translatedParseLogger);
		if (translatedTree === undefined) {
			plogger(`Parsing the translated code failed completely so unable to fix it.`);
			return;
		}
		const usesAsk = callsAsk(translatedCode);
		const ignoreWarnings = usesAsk;
		const parseLogger = new TestParseLogger(plogger, translatedCode, ignoreWarnings, isLoggingMessage(usesAsk));
		const finalTree = LogoParser.getParseTree(translatedCode, parseLogger, new Map());
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