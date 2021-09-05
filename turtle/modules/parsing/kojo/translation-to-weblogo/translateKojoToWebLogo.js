import { clashingProcedureNameFixer } from
'../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixCode } from
'../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../components/code-editor/format/formatCode.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { getReferencedProcedures } from './getReferencedProcedures.js';
import { joinConsecutiveCommandCalls } from
'../../../components/code-editor/code-fixer/fixers/helpers/joinConsecutiveCommandCalls.js';
import { jumpFixer } from
'../../../components/code-editor/code-fixer/fixers/jumpFixer.js';
import { LogoParser } from '../../LogoParser.js';
import { needsInitialPenColor } from './needsInitialPenColor.js';
import { needsSavePosHeVariable } from './needsSavePosHeVariable.js';
import { parse } from '../parsing/parse.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { processComment } from './type-processors/processComment.js';
import { processToken } from './type-processors/processToken.js';
import { removeDoNothingCommandCalls } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeDoNothingCommandCalls.js';
import { removeEmptyIfStatements } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeEmptyIfStatements.js';
import { removeUnneededCurvedBrackets } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { replaceCommandsToFitDataTypes } from
'./replaceCommandsToFitDataTypes.js';
import { simplify } from
'./simplifiers/simplify.js';

export function translateKojoToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	const settings = {
		'tokenProcessors': new Map()
	};
	simplify(parseResult.root);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let resultCode = replaceCommandsToFitDataTypes(result.toString());

	const referencedProcedures = getReferencedProcedures(resultCode);
	if (referencedProcedures !== '') {
		resultCode = referencedProcedures + resultCode;
	}

	const parseLogger = new ParseLogger();
	let tree = LogoParser.getParseTree(resultCode, parseLogger);
	if (tree === undefined)
		return resultCode; // can't go any farther.

	let reparseNeeded = false;
	if (needsSavePosHeVariable(resultCode)) {
		resultCode = 'make "savePosHe []\n' + resultCode;
		reparseNeeded = true;
	}
	if (needsInitialPenColor(resultCode)) {
		resultCode = 'setPenColor "red\n' + resultCode;
		reparseNeeded = true;
	}
	if (reparseNeeded) {
		tree = LogoParser.getParseTree(resultCode, parseLogger);
		if (tree === undefined)
			return resultCode; // can't go any farther.
	}
	const extraFixers = [clashingProcedureNameFixer, joinConsecutiveCommandCalls, jumpFixer,
		removeDoNothingCommandCalls, removeEmptyIfStatements, removeUnneededCurvedBrackets];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(resultCode, fixLogger, proceduresMap, tree, extraFixers);
	return formatCode(fixedCode);
};