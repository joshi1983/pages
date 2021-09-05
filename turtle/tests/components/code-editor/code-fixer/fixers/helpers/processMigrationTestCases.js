import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { FixLogger } from
'../../../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../../../modules/components/code-editor/format/formatCode.js';
import { getProceduresMap } from
'../../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../../../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { LogoParser } from
'../../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../../modules/parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function processMigrationTestCases(cases, logger, migrateFunction) {
	if (typeof migrateFunction !== 'function')
		throw new Error(`migrateFunction must be a function but found ${migrateFunction}`);
	cases.forEach(function(caseInfo, index) {
		if (typeof caseInfo.migrationInfo !== 'object')
			throw Error(`migrationInfo must be an object but found ${caseInfo.migrationInfo}`);

		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new ParseLogger();
		const fixLogger = new FixLogger(parseLogger);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger, undefined);
		if (tree === undefined) {
			plogger(`Expected to parse without issue but parsing failed.`);
			return;
		}
		const proceduresMap = getProceduresMap(tree);
		const wtree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
		const migrationInfo = caseInfo.migrationInfo;
		migrateFunction(wtree, fixLogger, migrationInfo);
		const fixedCode = parseTreeToCodeWithComments(tree, caseInfo.code);
		const formatted = formatCode(harmonizeCase(fixedCode));
		const outCode = formatted.trim();
		if (outCode !== caseInfo.out)
			assertEquals(caseInfo.out, outCode, plogger);
	});
};