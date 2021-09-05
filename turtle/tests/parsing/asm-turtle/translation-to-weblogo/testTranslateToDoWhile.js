import { getDescendentsOfType } from '../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function isTranslatedToDoWhile(asmTurtleCode) {
	const webLogoCode = translate(asmTurtleCode);
	const parseLogger = new ParseLogger();
	const parseTree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (parseTree === undefined)
		return false;
	const dowhileTokens = getDescendentsOfType(parseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => token.val.toLowerCase() === 'do.while');
	return dowhileTokens.length !== 0;
}

function testIsTranslatedToDoWhile(logger) {
	const cases = [
	];
	testInOutPairs(cases, isTranslatedToDoWhile, logger);
}

function testInOut(logger) {
	const cases = [
	{
		'in': '@@doWhileStart:\nfd 1\nje @doWhileStart',
		'out': 'make "comparisonRegister 0\ndo.while [\n\tforward 1\n] :comparisonRegister = 0'
	},
	{
		'in': '@@doWhileStart:\nrt 1\nfd 1\njne @doWhileStart',
		'out': 'make "comparisonRegister 0\ndo.while [\n\tright 1\n\tforward 1\n] :comparisonRegister <> 0'
	},
	];
	testInOutPairs(cases, translate, logger);
}

export function testTranslateToDoWhile(logger) {
	wrapAndCall([
		testInOut,
		testIsTranslatedToDoWhile
	], logger);
};