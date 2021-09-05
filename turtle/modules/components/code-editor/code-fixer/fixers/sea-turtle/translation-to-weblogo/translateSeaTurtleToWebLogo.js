import { colourIndexEvaluator } from
'./colourIndexEvaluator.js';
import { fetchJson } from
'../../../../../../fetchJson.js';
import { FixLogger } from
'../../../FixLogger.js';
import { formatCode } from
'../../../../format/formatCode.js';
import { getProceduresMap } from
'../../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../../../../../parsing/parseTreeToCodeWithComments.js';
import { processOperatorToCommand } from
'../../helpers/processOperatorToCommand.js';
import { scan } from
'../scanning/scan.js';
import { scanTokensToCode } from
'../../helpers/scanTokensToCode.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

const info = await fetchJson('json/logo-migrations/sea-turtle/SeaTurtle.json');

export function translateSeaTurtleToWebLogo(code) {
	const tokens = scan(code);
	code = scanTokensToCode(tokens);
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree !== undefined) {
		const cachedParseTree = new WriteOptimizedCachedParseTree(tree, getProceduresMap(tree));
		processOperatorToCommand(cachedParseTree, fixLogger, info);
		colourIndexEvaluator(cachedParseTree, fixLogger);
		code = parseTreeToCodeWithComments(tree, code);
	}
	return formatCode(code);
};