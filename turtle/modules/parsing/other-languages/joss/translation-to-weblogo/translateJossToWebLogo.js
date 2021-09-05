import { clashingProcedureNameFixer } from
'../../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { convertLoopsToForever } from
'../../../../components/code-editor/code-fixer/fixers/helpers/convertLoopsToForever.js';
import { fixCode } from
'../../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getProceduresMap } from
'../../../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../LogoParser.js';
import { parse } from '../parsing/parse.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { processComment } from './type-processors/processComment.js';
import { processTreeRoot } from './type-processors/processTreeRoot.js';
import { removeUnneededCurvedBrackets } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { stopRemoveFixer } from
'../../../../components/code-editor/code-fixer/fixers/stopRemoveFixer.js';

const extraFixers = [clashingProcedureNameFixer, convertLoopsToForever,
removeUnneededCurvedBrackets, stopRemoveFixer];

export function translateJossToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	processTreeRoot(parseResult.root, result);
	result.processAllRemainingComments();
	let translatedCode = result.toString();
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	const tree = LogoParser.getParseTree(translatedCode, parseLogger);
	if (tree !== undefined) {
		const proceduresMap = getProceduresMap(tree);
		translatedCode = fixCode(translatedCode, fixLogger, proceduresMap, tree, extraFixers);
	}
	return formatCode(translatedCode);
};