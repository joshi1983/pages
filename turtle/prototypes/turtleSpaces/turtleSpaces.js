import { FixLogger } from
'../../modules/components/code-editor/code-fixer/FixLogger.js';
import { getProceduresMap } from
'../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { MigrationInfo } from
'../../modules/parsing/other-languages/turtleSpaces/MigrationInfo.js';
import { ParseLogger } from
'../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { ready } from
'../../modules/ready.js';
import { scan } from
'../../modules/parsing/other-languages/turtleSpaces/scanning/scan.js';
import { translateTurtleSpacesToWebLogo } from
'../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/translateTurtleSpacesToWebLogo.js';
import { turtleSpacesFixers } from
'../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/fixers/turtleSpacesFixers.js';
import { WriteOptimizedCachedParseTree } from
'../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

let afterFixers;
let turtleSpacesCode = `foreach "i [1 2 3] [
	show :i
]`;

function parse(code) {
	const parseLogger = new ParseLogger();
	const tokens = scan(code);
	const tree = LogoParser.getParseTree(tokens, parseLogger);
	if (afterFixers.checked) {
		const fixLogger = new FixLogger(parseLogger);
		const proceduresMap = getProceduresMap(tree);
		const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
		turtleSpacesFixers(cachedParseTree, fixLogger);
	}
	return tree;
}

function translate(code) {
	const parseLogger = new ParseLogger();
	return translateTurtleSpacesToWebLogo(code, parseLogger);
}


function init() {
	afterFixers = document.getElementById('after-fixers');
	const gParsing = initGenericParsing(ParseTreeTokenType, parse, turtleSpacesCode, undefined, undefined, translate);
	afterFixers.addEventListener('change', gParsing.refreshOutputs);
}

ready(init);