import { arrayLiteralFixer } from
'../../../components/code-editor/code-fixer/fixers/arrayLiteralFixer.js';
import { askFixer } from
'../../../components/code-editor/code-fixer/fixers/askFixer.js';
import { catchFixer } from
'../../../components/code-editor/code-fixer/fixers/catchFixer.js';
import { clashingProcedureNameFixer } from
'../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { defineFixer } from
'../../../components/code-editor/code-fixer/fixers/defineFixer.js';
import { fetchJson } from
'../../../fetchJson.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { fmsParseOptions } from '../fmsParseOptions.js';
import { foreachFixer } from
'../../../components/code-editor/code-fixer/fixers/foreachFixer.js';
import { forLoopVariableFixer } from
'../../../components/code-editor/code-fixer/fixers/forLoopVariableFixer.js';
import { formatCode } from
'../../../components/code-editor/format/formatCode.js';
import { harmonizeCase } from
'../../../components/code-editor/harmonize-case/harmonizeCase.js';
import { getProceduresMap } from
'../../parse-tree-analysis/getProceduresMap.js';
import { leafsInDataListsToStringLiteralsFixer } from
'../../../components/code-editor/code-fixer/fixers/leafsInDataListsToStringLiteralsFixer.js';
import { localFixer } from
'../../../components/code-editor/code-fixer/fixers/localFixer.js';
import { LogoParser } from '../../LogoParser.js';
import { nameCallFixer } from
'../../../components/code-editor/code-fixer/fixers/nameCallFixer.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../parseTreeToCodeWithComments.js';
import { processLogoMigration } from
'../../../components/code-editor/code-fixer/fixers/helpers/processLogoMigration.js';
import { quoteBooleanFixer } from
'../../../components/code-editor/code-fixer/fixers/quoteBooleanFixer.js';
import { sanitizeMigrationInfo } from
'../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';
import { scan } from '../scan.js';
import { setPenSizeFixer } from
'../../../components/code-editor/code-fixer/fixers/setPenSizeFixer.js';
import { thingCallFixer } from
'../../../components/code-editor/code-fixer/fixers/thingCallFixer.js';
import { throwFixer } from
'../../../components/code-editor/code-fixer/fixers/throwFixer.js';
import { tildeFixer } from
'../../../components/code-editor/code-fixer/fixers/tildeFixer.js';
import { variableNameReferenceFixer } from
'../../../components/code-editor/code-fixer/fixers/variableNameReferenceFixer.js';
import { WriteOptimizedCachedParseTree } from
'../../parse-tree-analysis/WriteOptimizedCachedParseTree.js';
const migrationInfo = await fetchJson('json/logo-migrations/FMSLogo.json');
sanitizeMigrationInfo(migrationInfo);

const fixers = [
	arrayLiteralFixer,
	askFixer,
	catchFixer,
	clashingProcedureNameFixer,
	defineFixer,
	foreachFixer,
	forLoopVariableFixer,
	leafsInDataListsToStringLiteralsFixer,
	localFixer,
	nameCallFixer,
	quoteBooleanFixer,
	setPenSizeFixer,
	thingCallFixer,
	throwFixer,
	tildeFixer,
	variableNameReferenceFixer
];

function treeToCode(tree, fmsCode) {
	const fixedCode = parseTreeToCodeWithComments(tree, fmsCode);
	const formatted = formatCode(harmonizeCase(fixedCode));
	return formatted.trim();
}

export function translate(fmsCode) {
	const parseLogger = new ParseLogger();
	const scannedTokens = scan(fmsCode);
	const tree = LogoParser.getParseTree(scannedTokens, parseLogger, undefined, fmsParseOptions);
	const proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	const fixLogger = new FixLogger(parseLogger);
	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);
	for (const fixer of fixers) {
		fixer(cachedParseTree, fixLogger);
	}
	return treeToCode(tree, fmsCode);
};