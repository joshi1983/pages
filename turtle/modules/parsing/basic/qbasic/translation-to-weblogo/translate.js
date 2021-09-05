import { clashingProcedureNameFixer } from
'../../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixCode } from
'../../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getAnalyzedVariables } from
'../parsing/parse-tree-analysis/variable-data-types/variables/getAnalyzedVariables';
import { getIdentifierRenameMap } from './getIdentifierRenameMap.js';
import { getProceduresMap } from '../../../parse-tree-analysis/getProceduresMap.js';
import { includeAllReferencedProcedures } from './includeAllReferencedProcedures.js';
import { LogoParser } from '../../../LogoParser.js';
import { mightDrawSomething } from './mightDrawSomething.js';
import { parse } from '../parse.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { processCommentToken } from './type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { refactor } from './refactoring/refactor.js';
import { removeEmptyIfStatements } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeEmptyIfStatements.js';
import { removeUnusedAssignments } from
'../../../../components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';
import { removeUnneededCurvedBrackets } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { shouldIgnoreScreenCalls } from
'./shouldIgnoreScreenCalls.js';
import { stopRemoveFixer } from
'../../../../components/code-editor/code-fixer/fixers/stopRemoveFixer.js';
import { translateDataSections } from './translateDataSections.js';
import { undefinedBooleanLiteralFixer } from
'../../../../components/code-editor/code-fixer/fixers/undefinedBooleanLiteralFixer.js';

const extraFixers = [undefinedBooleanLiteralFixer, clashingProcedureNameFixer,
removeEmptyIfStatements, removeUnusedAssignments, removeUnneededCurvedBrackets, stopRemoveFixer];

export function translate(code, optionalParseLogger, optionalFirstFixer) {
	if (optionalParseLogger !== undefined && !(optionalParseLogger instanceof ParseLogger))
		throw new Error(`optionalParseLogger must either be undefined or a ParseLogger but found ${optionalParseLogger}`);
	if (optionalFirstFixer !== undefined && typeof optionalFirstFixer !== 'function')
		throw new Error(`optionalFirstFixer can be undefined or a function but found ${optionalFirstFixer}`);

	// translate QBasic to WebLogo.
	const parseResult = parse(code);
	refactor(parseResult.root);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	const options = {
		'ignoreScreenCalls': shouldIgnoreScreenCalls(parseResult.root),
		'identifierRenameMap': getIdentifierRenameMap(parseResult.root),
		'variables': getAnalyzedVariables(parseResult.root)
	};
	includeAllReferencedProcedures(parseResult.root, result, options);
	translateDataSections(parseResult.root, result, options);
	if (mightDrawSomething(parseResult.root))
		result.append('\nsetScreenColor "black\n');
	processToken(parseResult.root, result, options);
	result.processAllRemainingComments();
	const translated = result.toString().trim();

	// run code fixers.
	let parseLogger;
	if (optionalParseLogger === undefined)
		parseLogger = new ParseLogger();
	else
		parseLogger = optionalParseLogger;
	const tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.

	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	let firstFixers = [];
	if (optionalFirstFixer !== undefined)
		firstFixers.splice(0, 0, optionalFirstFixer);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers, firstFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};