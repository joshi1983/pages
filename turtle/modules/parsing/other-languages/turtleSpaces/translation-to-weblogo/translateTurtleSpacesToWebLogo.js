import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getProceduresMap } from
'../../../parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../../components/code-editor/harmonize-case/harmonizeCase.js';
import { LogoParser } from
'../../../LogoParser.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { processLogoMigration } from
'../../../../components/code-editor/code-fixer/fixers/helpers/processLogoMigration.js';
import { scan } from
'../scanning/scan.js';
import { turtleSpacesFixers } from
'./fixers/turtleSpacesFixers.js';
import { wrappedFix } from
'../../../../components/code-editor/code-fixer/wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function translateTurtleSpacesToWebLogo(code) {
	const parseLogger = new ParseLogger();
	const tokens = scan(code);
	const tree = LogoParser.getParseTree(tokens, parseLogger);
	if (tree === undefined)
		return code; // if we can't parse, we can't fix the code.

	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	processLogoMigration(cachedParseTree, fixLogger, MigrationInfo);

	const fixedCode = wrappedFix(code, turtleSpacesFixers, fixLogger, proceduresMap, tree);

	return formatCode(harmonizeCase(fixedCode));
};