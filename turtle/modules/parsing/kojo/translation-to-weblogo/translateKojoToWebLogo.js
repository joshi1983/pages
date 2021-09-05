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
import { replaceCommandsToFitDataTypesFixer } from
'./replaceCommandsToFitDataTypesFixer.js';
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
	let resultCode = result.toString();
	const referencedProcedures = getReferencedProcedures(resultCode);
	if (referencedProcedures !== '') {
		resultCode = referencedProcedures + resultCode;
	}

	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(resultCode, parseLogger);
	if (tree === undefined)
		return resultCode; // can't go any farther.

	if (needsSavePosHeVariable(resultCode)) {
		resultCode = 'make "savePosHe []\n' + resultCode;
	}
	if (needsInitialPenColor(resultCode))
		resultCode = 'setPenColor "red\n' + resultCode;

	replaceCommandsToFitDataTypesFixer(tree);
	const extraFixers = [clashingProcedureNameFixer, removeDoNothingCommandCalls,
		removeEmptyIfStatements, removeUnneededCurvedBrackets];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(resultCode, fixLogger, proceduresMap, tree, extraFixers);
	return formatCode(fixedCode);
};