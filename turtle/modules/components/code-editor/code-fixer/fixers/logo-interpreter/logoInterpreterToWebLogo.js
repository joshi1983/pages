import { Command } from
'../../../../../parsing/Command.js';
import { fetchJson } from
'../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from '../../../format/formatCode.js';
import { fullCircleArcFixer } from
'./fullCircleArcFixer.js';
import { getProceduresMap } from
'../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../harmonize-case/harmonizeCase.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../../../../parsing/parseTreeToCodeWithComments.js';
import { plusNumberLiteralFixer } from
'./plusNumberLiteralFixer.js';
import { processLogoMigration } from
'../helpers/processLogoMigration.js';
import { runAllFixers } from
'../../runAllFixers.js';
import { sanitizeMigrationInfo } from
'../helpers/sanitizeMigrationInfo.js';
import { setPosBeforeBeginPathFixer } from
'./setPosBeforeBeginPathFixer.js';
import { wrappedFix } from '../../wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await LogoParser.asyncInit();
await Command.asyncInit();
const migrationInfo = await fetchJson('json/logo-migrations/LogoInterpreter.json');
sanitizeMigrationInfo(migrationInfo);

const allFixer = runAllFixers([fullCircleArcFixer, plusNumberLiteralFixer, setPosBeforeBeginPathFixer]);

function treeToCode(tree, code) {
	const fixedCode = parseTreeToCodeWithComments(tree, code);
	const formatted = formatCode(harmonizeCase(fixedCode));
	return formatted.trim();
}

export function logoInterpreterToWebLogo(code, parseLogger) {
	const tempParseLogger = new ParseLogger();
	let tree = LogoParser.getParseTree(code, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.

	let proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(tempParseLogger);
	code = wrappedFix(code, allFixer,
		fixLogger, proceduresMap, tree);
	tree = LogoParser.getParseTree(code, tempParseLogger);

	proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);

	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);

	return treeToCode(tree, code);
};