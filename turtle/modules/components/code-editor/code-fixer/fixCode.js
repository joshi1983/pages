import { animationSetupFixer } from './fixers/animationSetupFixer.js';
import { animationSnapshotStyleFixer } from './fixers/animationSnapshotStyleFixer.js';
import { booleanExpressionAsListFixer } from './fixers/booleanExpressionAsListFixer.js';
import { colourStringLiteralFixer } from './fixers/colourStringLiteralFixer.js';
import { commaFixer } from './fixers/commaFixer.js';
import { commandTranslationFixer } from './fixers/commandTranslationFixer.js';
import { defineFixer } from './fixers/defineFixer.js';
import { erroneousSpacesFixer } from './fixers/erroneousSpacesFixer.js';
import { filledFixer } from './fixers/filledFixer.js';
import { FixLogger } from './FixLogger.js';
import { forLoopVariableFixer } from './fixers/forLoopVariableFixer.js';
import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { leafsInDataListsToStringLiteralsFixer } from './fixers/leafsInDataListsToStringLiteralsFixer.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { missingSpacesFixer } from './fixers/missingSpacesFixer.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../../parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';
import { procedureInProcedureFixer } from './fixers/procedureInProcedureFixer.js';
import { quoteColourNameLeafs } from './fixers/quoteColourNameLeafs.js';
import { quoteIntegerFixer } from './fixers/quoteIntegerFixer.js';
import { quoteNumberFixer } from './fixers/quoteNumberFixer.js';
import { replaceSpecialQuoteCharactersWithNormalQuotes } from './fixers/replaceSpecialQuoteCharactersWithNormalQuotes.js';
import { setPenSizeFixer } from './fixers/setPenSizeFixer.js';
import { unrecognizedParameterizedGroupNameFixer } from './fixers/unrecognizedParameterizedGroupNameFixer.js';
import { variableNameReferenceFixer } from './fixers/variableNameReferenceFixer.js';
import { WriteOptimizedCachedParseTree } from '../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await ParseTreeToken.asyncInit();

export function fixCode(code, fixLogger, proceduresMap, tree) {
	if (fixLogger instanceof ParseLogger)
		fixLogger = new FixLogger(fixLogger);
	else if (!(fixLogger instanceof FixLogger))
		throw new Error('fixLogger must be an instance of FixLogger or ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
	if (tree !== undefined && !(tree instanceof ParseTreeToken))
		throw new Error('tree must either be undefined or be a ParseTreeToken.  Not: ' + tree);

	const parseLogger = new ParseLogger();
	if (tree === undefined)
		tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors())
		return code; // the code is unfixable if it can't be parsed.
	else {
		// make sure any procedures defined in the code are scraped from tree 
		// and not whatever parse tree the caller used.
		// This is important for when the fixers try to change the parse tree tokens.
		const treeProceduresMap = getProceduresMap(tree);
		for (const [key, value] of treeProceduresMap) {
			proceduresMap.set(key, value);
		}
		const writableCachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
		animationSetupFixer(writableCachedParseTree, fixLogger);
		animationSnapshotStyleFixer(writableCachedParseTree, fixLogger);
		booleanExpressionAsListFixer(writableCachedParseTree, fixLogger);
		colourStringLiteralFixer(writableCachedParseTree, fixLogger);
		commaFixer(writableCachedParseTree, fixLogger);
		commandTranslationFixer(writableCachedParseTree, fixLogger);
		defineFixer(writableCachedParseTree, fixLogger);
		erroneousSpacesFixer(writableCachedParseTree, fixLogger);
		filledFixer(writableCachedParseTree, fixLogger);
		forLoopVariableFixer(writableCachedParseTree, fixLogger);
		leafsInDataListsToStringLiteralsFixer(writableCachedParseTree, fixLogger);
		missingSpacesFixer(writableCachedParseTree, fixLogger);
		procedureInProcedureFixer(writableCachedParseTree, fixLogger);
		quoteColourNameLeafs(writableCachedParseTree, fixLogger);
		quoteIntegerFixer(writableCachedParseTree, fixLogger);
		quoteNumberFixer(writableCachedParseTree, fixLogger);
		replaceSpecialQuoteCharactersWithNormalQuotes(writableCachedParseTree, fixLogger);
		setPenSizeFixer(writableCachedParseTree, fixLogger);
		unrecognizedParameterizedGroupNameFixer(writableCachedParseTree, fixLogger);
		variableNameReferenceFixer(writableCachedParseTree, fixLogger);

		return parseTreeToCodeWithComments(tree, code);
	}
};