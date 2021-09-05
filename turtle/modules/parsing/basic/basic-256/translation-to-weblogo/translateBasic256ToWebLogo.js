import { Command } from
'../../../Command.js';
import { fetchJson } from
'../../../../fetchJson.js';
import { fixCode } from
'../../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getAllReferencedProcedures } from
'./getAllReferencedProcedures.js';
import { getProceduresMap } from
'../../../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../LogoParser.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { processLogoMigration } from
'../../../../components/code-editor/code-fixer/fixers/helpers/processLogoMigration.js';
import { isApplicableTo, processToken } from
'./type-processors/processToken.js';
import { removeCommandsWithoutRequiredParameters } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeCommandsWithoutRequiredParameters.js';
import { sanitizeMigrationInfo } from
'../../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { WriteOptimizedCachedParseTree } from
'../../../parse-tree-analysis/WriteOptimizedCachedParseTree.js';
const migrationInfo = await fetchJson('json/logo-migrations/basic/basic-256/migrationToWebLogo.json');
sanitizeMigrationInfo(migrationInfo);
await Command.asyncInit();

const extraFixers = [removeCommandsWithoutRequiredParameters];

export function translateBasic256ToWebLogo(basic256Code) {
	const tokens = scan(basic256Code);
	const qbasicCode = scanTokensToCode(tokens);
	const options = {
		'shouldUseCustomProcessTokenForToken': isApplicableTo,
		'processToken': processToken
	};
	let translated = translateQBASICToWebLogo(qbasicCode, options);
	const parseLogger = new ParseLogger();
	let tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.
	const proceduresCode = getAllReferencedProcedures(tree);
	if (proceduresCode !== '') {
		translated = proceduresCode + '\n\n' + translated;
		tree = LogoParser.getParseTree(translated, parseLogger);
		if (tree === undefined)
			return translated; // can't go any farther.
	}
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	processLogoMigration(cachedParseTree, fixLogger, migrationInfo);
	const firstFixers = [];
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers, firstFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};