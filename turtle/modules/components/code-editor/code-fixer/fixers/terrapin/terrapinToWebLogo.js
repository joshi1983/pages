import { addAllReferencedProcedures } from './addAllReferencedProcedures.js';
import { askFixer } from '../askFixer.js';
import { booleanExpressionAsListFixer } from '../booleanExpressionAsListFixer.js';
import { Command } from
'../../../../../parsing/Command.js';
import { convertForeachSymbolFixer } from './convertForeachSymbolFixer.js';
import { defineFixer } from '../defineFixer.js';
import { fetchJson } from
'../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { foreachFixer } from '../foreachFixer.js';
import { formatCode } from '../../../format/formatCode.js';
import { forFixer } from './forFixer.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { goFixer } from './goFixer.js';
import { harmonizeCase } from
'../../../harmonize-case/harmonizeCase.js';
import { hatSymbolPowerFixer } from '../hatSymbolPowerFixer.js';
import { ifInstructionListFixer } from './ifInstructionListFixer.js';
import { leafsInDataListsToStringLiteralsFixer } from '../leafsInDataListsToStringLiteralsFixer.js';
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
import { setFontFixer } from './setFontFixer.js';
import { slashFixer } from './slashFixer.js';
import { stopRemoveFixer } from '../stopRemoveFixer.js';
import { testFixer } from '../testFixer.js';
import { thenFixer } from './thenFixer.js';
import { thingCallFixer } from '../thingCallFixer.js';
import { useStrFixer } from '../useStrFixer.js';
import { wrappedFix } from '../../wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await LogoParser.asyncInit();
await Command.asyncInit();
const migrationInfo = await fetchJson('json/logo-migrations/TerrapinWebLogo.json');
sanitizeMigrationInfo(migrationInfo);

const testFixerOptions = {
	'testNames': new Set(['test']),
	'iffalseNames': new Set(['iffalse', 'iff']),
	'iftrueNames': new Set(['iftrue', 'ift'])
};
const terrapinTestFixer = testFixer(testFixerOptions);

const allFixer = runAllFixers([askFixer, booleanExpressionAsListFixer,
convertForeachSymbolFixer, defineFixer,
foreachFixer, forFixer, goFixer, hatSymbolPowerFixer, ifInstructionListFixer,
leafsInDataListsToStringLiteralsFixer, localFixer,
minusFixer, nameCallFixer, runFixer, setFontFixer,
slashFixer, stopRemoveFixer, terrapinTestFixer, thenFixer, thingCallFixer, useStrFixer]);

const afterMigrationFixer = runAllFixers([stopRemoveFixer]);

function treeToCode(tree, code) {
	const fixedCode = parseTreeToCodeWithComments(tree, code);
	const formatted = formatCode(harmonizeCase(fixedCode));
	return formatted.trim();
}

export function terrapinToWebLogo(code, parseLogger) {
	const tempParseLogger = new ParseLogger();
	const scanTokens = scan(code).filter(t => t.s[0] !== ';');
	// filter out comments.

	let tree = LogoParser.getParseTree(scanTokens, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.
	let proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(tempParseLogger);
	code = wrappedFix(code, allFixer, fixLogger, proceduresMap, tree);
	code = addAllReferencedProcedures(code);
	
	tree = LogoParser.getParseTree(scan(code), tempParseLogger);
	if (tree === undefined)
		return code;

	proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);

	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);
	code = wrappedFix(code, afterMigrationFixer, fixLogger, proceduresMap, tree);

	return treeToCode(tree, code);
};