import { CachedParseTree } from
'../parsing/parse-tree-analysis/CachedParseTree.js';
import { clashingProcedureNameFixer } from
'../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
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
import { processJavaLikeCommentToken } from '../../generic-parsing-utilities/processJavaLikeCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { removeUnneededCurvedBrackets } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';

export function translate(code) {
	// Translate Java-like Processing code to WebLogo.
	const parseResult = parse(code);
	const settings = {
		'cachedParseTree': new CachedParseTree(parseResult.root)
	};
	const result = new CommentDumpingStringBuffer(parseResult.comments,
		processJavaLikeCommentToken);
	includeAllReferencedProcedures(settings.cachedParseTree, parseResult.root, result);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	const translated = result.toString().trim();

	// run code fixers.
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.
	const extraFixers = [clashingProcedureNameFixer, removeUnneededCurvedBrackets];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};