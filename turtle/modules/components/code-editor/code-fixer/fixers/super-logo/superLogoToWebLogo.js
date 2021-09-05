import { BufferedParseLogger } from '../../../../../parsing/loggers/BufferedParseLogger.js';
import { clashingProcedureNameFixer } from '../clashingProcedureNameFixer.js';
import { elseCurvedBracketFixer } from './elseCurvedBracketFixer.js';
import { fetchJson } from '../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from '../../../format/formatCode.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { joinHyphenatedProcedureNames } from './joinHyphenatedProcedureNames.js';
import { LogoParser } from '../../../../../parsing/LogoParser.js';
import { LogoScanner } from '../../../../../parsing/LogoScanner.js';
import { processLogoMigration } from '../helpers/processLogoMigration.js';
import { replaceCurvedBracketsFixer } from './replaceCurvedBracketsFixer.js';
import { runAllFixers } from '../../runAllFixers.js';
import { sanitizeMigrationInfo } from '../helpers/sanitizeMigrationInfo.js';
import { testFixer } from '../testFixer.js';
import { variableNameReferenceFixer } from '../variableNameReferenceFixer.js';
import { wrappedFix } from '../../wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await LogoParser.asyncInit();

const testFixerOptions = {
	'testNames': new Set(['test']),
	'iffalseNames': new Set(['iffalse']),
	'iftrueNames': new Set(['iftrue'])
};
const superLogoTestFixer = testFixer(testFixerOptions);

const fixers = [
	clashingProcedureNameFixer,
	elseCurvedBracketFixer,
	replaceCurvedBracketsFixer,
	superLogoTestFixer,
	variableNameReferenceFixer
];
const info = await fetchJson('json/logo-migrations/SuperLogo.json');
sanitizeMigrationInfo(info);
const fixer = runAllFixers(fixers);

export function superLogoToWebLogo(code, parseLogger) {
	const tempParseLogger = new BufferedParseLogger();
	const scanTokens = LogoScanner.scan(code, tempParseLogger);
	joinHyphenatedProcedureNames(scanTokens);
	let tree = LogoParser.getParseTree(scanTokens, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.

	const cachedParseTree = new WriteOptimizedCachedParseTree(tree);
	const fixLogger = new FixLogger(parseLogger);
	processLogoMigration(cachedParseTree, fixLogger, info);

	const proceduresMap = getProceduresMap(tree);
	code = wrappedFix(code, fixer, fixLogger, proceduresMap, tree);

	return formatCode(code, fixLogger);
};