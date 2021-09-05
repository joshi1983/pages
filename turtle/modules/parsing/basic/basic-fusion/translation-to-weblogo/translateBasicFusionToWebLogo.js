import { fetchJson } from
'../../../../fetchJson.js';
import { fixCode } from
'../../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getProceduresMap } from
'../../../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../LogoParser.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { processLogoMigration } from
'../../../../components/code-editor/code-fixer/fixers/helpers/processLogoMigration.js';
import { sanitizeMigrationInfo } from
'../../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';
import { scan } from
'../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { WriteOptimizedCachedParseTree } from
'../../../parse-tree-analysis/WriteOptimizedCachedParseTree.js';

const migrationInfo = await fetchJson('json/logo-migrations/basic/basic-fusion/migrationToWebLogo.json');
sanitizeMigrationInfo(migrationInfo);

const extraFixers = [];

export function translateBasicFusionToWebLogo(code) {
	const scanTokens = scan(code);
	const qbasicCode = scanTokensToCode(scanTokens);
	const options = {};
	let translated = translateQBASICToWebLogo(qbasicCode, options);

	const parseLogger = new ParseLogger();
	let tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.

	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);
	const firstFixers = [];
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers, firstFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};