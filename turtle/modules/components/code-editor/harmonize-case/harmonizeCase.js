import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { harmonizeBooleanLiterals } from './harmonizeBooleanLiterals.js';
import { harmonizeCommandNameCase } from './harmonizeCommandNameCase.js';
import { harmonizeKeywordCase } from './harmonizeKeywordCase.js';
import { harmonizeProcedureNameCase } from './harmonizeProcedureNameCase.js';
import { harmonizeVariableNameCase } from './harmonizeVariableNameCase.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../../parsing/parseTreeToCodeWithComments.js';
import { WriteOptimizedCachedParseTree } from '../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

const harmonizers = [
	harmonizeBooleanLiterals,
	harmonizeCommandNameCase,
	harmonizeKeywordCase,
	harmonizeProcedureNameCase,
	harmonizeVariableNameCase
];

export function harmonizeCase(code, tree) {
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
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
		const writableCachedParseTree = new WriteOptimizedCachedParseTree(tree, treeProceduresMap);
		for (const harmonizer of harmonizers)
			harmonizer(writableCachedParseTree);
		
		return parseTreeToCodeWithComments(tree, code);
	}
};