import { clashingProcedureNameFixer } from '../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { convertJumps } from './jump-conversion/convertJumps.js';
import { fixCode } from
'../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from '../../../components/code-editor/format/formatCode.js';
import { getDistinctVariableNameForParseTree } from '../../generic-parsing-utilities/getDistinctVariableNameForParseTree.js';
import { getProcedureRenameMap } from './getProcedureRenameMap.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { initializeRegisterAndVariables } from './initializeRegisterAndVariables.js';
import { isStackNeeded } from './isStackNeeded.js';
import { LogoParser } from '../../LogoParser.js';
import { parse } from '../parse.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processComment } from './type-processors/processComment.js';
import { processGlobalStack } from '../../generic-parsing-utilities/processGlobalStack.js';
import { processPredefinedProcedures } from './processPredefinedProcedures.js';
import { processToken } from './type-processors/processToken.js';
import { removeUnusedAssignments } from
'../../../components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';
import { sanitize } from './sanitization/sanitize.js';
import { stopRemoveFixer } from '../../../components/code-editor/code-fixer/fixers/stopRemoveFixer.js';

export function translate(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	const settings = {
		'comparisonRegisterName': getDistinctVariableNameForParseTree('comparisonRegister', parseResult.root, ParseTreeTokenType.VARIABLE_REFERENCE),
		'registerName': getDistinctVariableNameForParseTree('register', parseResult.root, ParseTreeTokenType.VARIABLE_REFERENCE),
		'procedureRenameMap': getProcedureRenameMap(parseResult.root)
	};
	sanitize(parseResult.root);
	convertJumps(parseResult.root);
	initializeRegisterAndVariables(parseResult.root, result, settings);
	processGlobalStack(parseResult.root, result, settings, isStackNeeded(parseResult.root), ParseTreeTokenType.VARIABLE_REFERENCE);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let translated = result.toString().trim();
	translated = processPredefinedProcedures(translated);

	// run code fixers.
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.
	const extraFixers = [clashingProcedureNameFixer, removeUnusedAssignments, stopRemoveFixer];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};