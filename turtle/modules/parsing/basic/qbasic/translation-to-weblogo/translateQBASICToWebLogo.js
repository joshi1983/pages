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
import { genericInsertSpaces } from
'../../helpers/genericInsertSpaces.js';
import { genericSimplifyConditions } from
'../../../../components/code-editor/code-fixer/fixers/helpers/genericSimplifyConditions.js';
import { getAnalyzedVariables } from
'../parsing/parse-tree-analysis/variable-data-types/variables/getAnalyzedVariables.js';
import { getIdentifierRenameMap } from './getIdentifierRenameMap.js';
import { getProcedureStartToken } from
'../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { getProceduresMap } from '../../../parse-tree-analysis/getProceduresMap.js';
import { includeAllReferencedProcedures } from './includeAllReferencedProcedures.js';
import { LogoParser } from '../../../LogoParser.js';
import { mightDrawSomething } from './mightDrawSomething.js';
import { needsGlobalScreenVariable } from './referenced-procedures/needsGlobalScreenVariable.js';
import { parse } from '../parse.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { processCommentToken } from './type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { QBasicProcedures } from '../QBasicProcedures.js';
import { refactor } from './refactoring/refactor.js';
import { removeDoNothingCommandCalls } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeDoNothingCommandCalls.js';
import { removeEmptyIfStatements } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeEmptyIfStatements.js';
import { removeTrivialInfiniteLoops } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeTrivialInfiniteLoops.js';
import { removeUnusedAssignments } from
'../../../../components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';
import { removeUnneededCurvedBrackets } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { stopRemoveFixer } from
'../../../../components/code-editor/code-fixer/fixers/stopRemoveFixer.js';
import { tokenToProcedure } from
'../../../parse-tree-analysis/tokenToProcedure.js';
import { translateDataSections } from './translateDataSections.js';
import { undefinedBooleanLiteralFixer } from
'../../../../components/code-editor/code-fixer/fixers/undefinedBooleanLiteralFixer.js';

const QBasicProceduresSet = new Set(QBasicProcedures.map(s => {
	const index = s.lastIndexOf('.');
	s = s.substring(0, index);
	return s.toLowerCase();
}));
function shouldCheckToken(token) {
	const procToken = getProcedureStartToken(token);
	if (procToken === undefined)
		return true;

	const procedure = tokenToProcedure(procToken);
	return !QBasicProceduresSet.has(procedure.name);
}

const extraFixers = [undefinedBooleanLiteralFixer, clashingProcedureNameFixer,
removeDoNothingCommandCalls, removeEmptyIfStatements, removeTrivialInfiniteLoops,
removeUnusedAssignments, removeUnneededCurvedBrackets, genericSimplifyConditions(shouldCheckToken), stopRemoveFixer];

const insertSpaces = genericInsertSpaces([
	[/^\s*(\d+[ \t]+)?color\w/i, 1]
]);

export { insertSpaces };

export function translateQBASICToWebLogo(code, optionalParseLogger, optionalFirstFixer, qbasicParseTreeFixer, skipStringArgumentChecksFor) {
	if (optionalParseLogger !== undefined && !(optionalParseLogger instanceof ParseLogger))
		throw new Error(`optionalParseLogger must either be undefined or a ParseLogger but found ${optionalParseLogger}`);
	if (optionalFirstFixer !== undefined && typeof optionalFirstFixer !== 'function')
		throw new Error(`optionalFirstFixer can be undefined or a function but found ${optionalFirstFixer}`);
	if (qbasicParseTreeFixer !== undefined && typeof qbasicParseTreeFixer !== 'function')
		throw new Error(`qbasicParseTreeFixer can be undefined or a function but found ${qbasicParseTreeFixer}`);
	if (skipStringArgumentChecksFor !== undefined && typeof skipStringArgumentChecksFor !== 'function')
		throw new Error(`skipStringArgumentChecksFor must be either undefined or a function but found ${skipStringArgumentChecksFor}`);

	code = insertSpaces(code);

	// translate QBasic to WebLogo.
	const parseResult = parse(code);
	if (qbasicParseTreeFixer !== undefined) {
		qbasicParseTreeFixer(parseResult.root);
	}
	refactor(parseResult.root);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	const options = {
		'ignoreScreenCalls': !needsGlobalScreenVariable(parseResult.root),
		'identifierRenameMap': getIdentifierRenameMap(parseResult.root),
		'skipStringArgumentChecksFor': skipStringArgumentChecksFor,
		'variables': getAnalyzedVariables(parseResult.root)
	};
	includeAllReferencedProcedures(parseResult.root, result, options);
	translateDataSections(parseResult.root, result, options);
	if (mightDrawSomething(parseResult.root)) {
		result.append(`
setScreenColor "black
setPenColor "white
`);
	}
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