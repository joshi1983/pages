import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { translateSeaTurtleToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/sea-turtle/translation-to-weblogo/translateSeaTurtleToWebLogo.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { scan } from
'../../modules/components/code-editor/code-fixer/fixers/sea-turtle/scanning/scan.js';

let seaTurtleCode;
seaTurtleCode = ``;

function parse(code) {
	const parseLogger = new ParseLogger();
	const tokens = scan(code);
	const tree = LogoParser.getParseTree(tokens, parseLogger);
	return tree;
}

function translate(code) {
	const parseLogger = new ParseLogger();
	return translateSeaTurtleToWebLogo(code, parseLogger);
}

initGenericParsing(ParseTreeTokenType, parse, seaTurtleCode, undefined, undefined, translate);