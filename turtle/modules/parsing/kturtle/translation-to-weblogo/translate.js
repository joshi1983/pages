import { clashingProcedureNameFixer } from '../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixCode } from
'../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { formatCode } from '../../../components/code-editor/format/formatCode.js';
import { includeAllReferencedProcedures } from './includeAllReferencedProcedures.js';
import { LogoParser } from '../../LogoParser.js';
import { parse } from '../parse.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { processSingleLineCommentToken } from './type-processors/processSingleLineCommentToken.js';
import { processToken } from './type-processors/processToken.js';

export function translate(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processSingleLineCommentToken);
	includeAllReferencedProcedures(parseResult.root, result);
	processToken(parseResult.root, result);
	result.processAllRemainingComments();
	const translated = result.toString().trim();

	// run code fixers.
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.
	const extraFixers = [clashingProcedureNameFixer];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};