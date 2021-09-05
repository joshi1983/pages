import { getDescendentsOfType } from '../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function isTranslatedToWhile(asmTurtleCode) {
	const webLogoCode = translate(asmTurtleCode);
	const parseLogger = new ParseLogger();
	const parseTree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (parseTree === undefined)
		return false;
	const whileTokens = getDescendentsOfType(parseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => token.val.toLowerCase() === 'while');
	return whileTokens.length !== 0;
}

function testIsTranslatedToWhile(logger) {
	const cases = [
	{'in': '@@beforeWhile:\nje @endWhile\nfd 1\njne @beforeWhile\n@@endWhile:',
	'out': false},
	{'in': 'je @endWhile\nfd 1\njmp @afterWhile\n@@endWhile:\n@@afterWhile:',
	'out': false},
	{
		'in': '@@beforeWhile:\nje @endWhile\nfd 1\njmp @beforeWhile\nlt 10\n@@endWhile:',
		'out': false
	},
	];
	testInOutPairs(cases, isTranslatedToWhile, logger);
}

function testInOut(logger) {
	const cases = [
	{
		'in': '@@beforeWhile:\nje @endWhile\nfd 1\njmp @beforeWhile\n@@endWhile:',
		'out': 'make "comparisonRegister 0\nwhile :comparisonRegister <> 0 [\n\tforward 1\n]'
	},
	{
		'in': '@@beforeWhile:\nje @endWhile\nrt 1\nfd 1\njmp @beforeWhile\n@@endWhile:',
		'out': 'make "comparisonRegister 0\nwhile :comparisonRegister <> 0 [\n\tright 1\n\tforward 1\n]'
	},
	];
	testInOutPairs(cases, translate, logger);
}

export function testTranslateToWhile(logger) {
	wrapAndCall([
		testInOut,
		testIsTranslatedToWhile
	], logger);
};