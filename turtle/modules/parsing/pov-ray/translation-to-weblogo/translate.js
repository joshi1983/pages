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
import { processCommentToken } from './type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { sanitize } from './sanitization/sanitize.js';

export function translate(code) {
	// translate POVRay to WebLogo.
	const parseResult = parse(code);
	sanitize(parseResult.root);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
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