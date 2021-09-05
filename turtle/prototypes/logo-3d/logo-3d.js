import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { logo3DToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { scan } from
'../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/scan.js';

let logo3DCode;
logo3DCode = `true and (false and 3 < 4)`;

function parse(code) {
	const parseLogger = new ParseLogger();
	const scanInfo = scan(code);
	const tokens = scanInfo.tokens;
	const tree = LogoParser.getParseTree(tokens, parseLogger);
	return tree;
}

function translate(code) {
	const parseLogger = new ParseLogger();
	return logo3DToWebLogo(code, parseLogger);
}

initGenericParsing(ParseTreeTokenType, parse, logo3DCode, undefined, undefined, translate);