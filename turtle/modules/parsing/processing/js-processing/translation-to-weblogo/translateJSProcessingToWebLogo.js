import { clashingProcedureNameFixer } from
'../../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixCode } from
'../../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from '../../../../components/code-editor/format/formatCode.js';
import { getAllReferencedProcedures } from './getAllReferencedProcedures.js';
import { getProceduresMap } from '../../../parse-tree-analysis/getProceduresMap.js';
import { getProcCallsCodeSnippetFor } from './getProcCallsCodeSnippetFor.js';
import { LogoParser } from '../../../LogoParser.js';
import { parse } from '../../../js-parsing/parse.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { processJavaLikeCommentToken } from
'../../../generic-parsing-utilities/processJavaLikeCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { removeUnneededCurvedBrackets } from
'../../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';

export function translateJSProcessingToWebLogo(code) {
	const parseResult = parse(code);
	const settings = {
	};
	const result = new CommentDumpingStringBuffer(parseResult.comments,
		processJavaLikeCommentToken);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let translated = result.toString().trim();

	// run code fixers.
	const parseLogger = new ParseLogger();
	let tree = LogoParser.getParseTree(translated, parseLogger);
	if (tree === undefined)
		return translated; // can't go any farther.

	const proceduresCode = getAllReferencedProcedures(tree);
	let reparseNeeded = false;
	if (proceduresCode !== '') {
		const translatedWithProcedures = proceduresCode + translated;
		translated = translatedWithProcedures;
		reparseNeeded = true;
	}
	const callsSnippet = getProcCallsCodeSnippetFor(tree);
	if (callsSnippet !== '') {
		translated += '\n' + callsSnippet;
		reparseNeeded = true;
	}
	if (reparseNeeded) {
		// Make the tree consistent with the translated code.
		tree = LogoParser.getParseTree(translated, parseLogger);
		if (tree === undefined)
			return translated;
	}
	const extraFixers = [clashingProcedureNameFixer, removeUnneededCurvedBrackets];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(translated, fixLogger, proceduresMap, tree, extraFixers);
	const formatted = formatCode(fixedCode);
	return formatted.trim();
};