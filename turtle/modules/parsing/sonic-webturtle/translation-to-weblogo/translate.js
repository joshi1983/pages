import { clashingProcedureNameFixer } from '../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixCode } from
'../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from '../../../components/code-editor/format/formatCode.js';
import { getProcedureRenameMap } from './getProcedureRenameMap.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { getVariableRenameMap } from './getVariableRenameMap.js';
import { isRememberStackNeeded } from './isRememberStackNeeded.js';
import { isStackNeeded } from './isStackNeeded.js';
import { LogoParser } from '../../LogoParser.js';
import { parse } from '../parse.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processComment } from './type-processors/processComment.js';
import { processGlobalStack } from '../../generic-parsing-utilities/processGlobalStack.js';
import { processPenStyle } from './processPenStyle.js';
import { processPredefinedProcedures } from './processPredefinedProcedures.js';
import { processToken } from './type-processors/processToken.js';
import { stopRemoveFixer } from '../../../components/code-editor/code-fixer/fixers/stopRemoveFixer.js';

export function translate(code) {
	// Translate Sonic WebTurtle code to WebLogo.
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	const settings = {
		'procedureRenameMap': getProcedureRenameMap(parseResult.root),
		'variableNamesMap': getVariableRenameMap(parseResult.root)
	};
	processGlobalStack(parseResult.root, result, settings, isRememberStackNeeded(parseResult.root), ParseTreeTokenType.VARIABLE_REFERENCE, 'rememberStack');
	processGlobalStack(parseResult.root, result, settings, isStackNeeded(parseResult.root), ParseTreeTokenType.VARIABLE_REFERENCE, 'stack');
	processPenStyle(parseResult.root, result, settings);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let translated = result.toString().trim();
	translated = processPredefinedProcedures(translated, settings);

	// run code fixers.
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.
	const extraFixers = [clashingProcedureNameFixer, stopRemoveFixer];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};