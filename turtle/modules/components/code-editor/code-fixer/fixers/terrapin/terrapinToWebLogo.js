import { askFixer } from '../askFixer.js';
import { Command } from
'../../../../../parsing/Command.js';
import { defineFixer } from '../defineFixer.js';
import { fetchJson } from
'../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from '../../../format/formatCode.js';
import { forFixer } from './forFixer.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../harmonize-case/harmonizeCase.js';
import { hatSymbolPowerFixer } from '../hatSymbolPowerFixer.js';
import { localFixer } from '../localFixer.js';
import { LogoParser } from '../../../../../parsing/LogoParser.js';
import { minusFixer } from './minusFixer.js';
import { nameCallFixer } from '../nameCallFixer.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../../../../parsing/parseTreeToCodeWithComments.js';
import { processLogoMigration } from
'../helpers/processLogoMigration.js';
import { runAllFixers } from
'../../runAllFixers.js';
import { runFixer } from '../runFixer.js';
import { sanitizeMigrationInfo } from
'../helpers/sanitizeMigrationInfo.js';
import { scan } from './scan.js';
import { slashFixer } from './slashFixer.js';
import { stopRemoveFixer } from '../stopRemoveFixer.js';
import { thenFixer } from './thenFixer.js';
import { thingCallFixer } from '../thingCallFixer.js';
import { wrappedFix } from '../../wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await LogoParser.asyncInit();
await Command.asyncInit();
const migrationInfo = await fetchJson('json/logo-migrations/TerrapinWebLogo.json');
sanitizeMigrationInfo(migrationInfo);

const allFixer = runAllFixers([askFixer, defineFixer, forFixer, hatSymbolPowerFixer,
localFixer, minusFixer, nameCallFixer, runFixer, slashFixer, stopRemoveFixer,
thenFixer, thingCallFixer]);

function treeToCode(tree, code) {
	const fixedCode = parseTreeToCodeWithComments(tree, code);
	const formatted = formatCode(harmonizeCase(fixedCode));
	return formatted.trim();
}

export function terrapinToWebLogo(code, parseLogger) {
	const tempParseLogger = new ParseLogger();
	const scanTokens = scan(code);
	let tree = LogoParser.getParseTree(scanTokens, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.
	let proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(tempParseLogger);
	code = wrappedFix(code, allFixer, fixLogger, proceduresMap, tree);
	tree = LogoParser.getParseTree(code, tempParseLogger);

	proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);

	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);

	return treeToCode(tree, code);
};