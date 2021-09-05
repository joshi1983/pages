import { clashingProcedureNameFixer } from
'../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { evaluateTokenDataTypes } from
'../parsing/parse-tree-analysis/variable-data-types/evaluateTokenDataTypes.js';
import { fixCode } from
'../../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../components/code-editor/format/formatCode.js';
import { getImportedPathsFrom  } from
'../parsing/parse-tree-analysis/getImportedPathsFrom.js';
import { getProceduresMap } from '../../parse-tree-analysis/getProceduresMap.js';
import { getReferencedProcedures} from
'./getReferencedProcedures.js';
import { LogoParser } from '../../LogoParser.js';
import { parse } from '../parsing/parse.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processComment } from './type-processors/processComment.js';
import { processToken } from './type-processors/processToken.js';
import { removeDoNothingCommandCalls } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeDoNothingCommandCalls.js';
import { removeEmptyIfStatements } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeEmptyIfStatements.js';
import { simplify } from './simplifiers/simplify.js';

function containsMainFunction(root) {
	return root.children.some(function(t) {
		if (t.type !== ParseTreeTokenType.FUNC)
			return false;
		const firstChild = t.children[0];
		return firstChild !== undefined && firstChild.val === 'main' &&
			firstChild.type === ParseTreeTokenType.IDENTIFIER;
	});
}

export function translatePitrifiedGoTurtleToWebLogo(code) {
	const parseResult = parse(code);
	simplify(parseResult.root);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	const settings = {
		'imports': getImportedPathsFrom(parseResult.root),
		'tokenProcessors': new Map()
	};
	settings.tokenDataTypes = evaluateTokenDataTypes(parseResult.root, settings);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let resultCode = result.toString();
	const referencedProcedures = getReferencedProcedures(resultCode);
	if (referencedProcedures !== '') {
		resultCode = referencedProcedures + resultCode;
	}
	if (containsMainFunction(parseResult.root))
		resultCode += '\n\nmain';

	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(resultCode, parseLogger);
	if (tree === undefined)
		return resultCode; // can't go any farther.
	
	const extraFixers = [clashingProcedureNameFixer, removeDoNothingCommandCalls, removeEmptyIfStatements];
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree);
	const fixedCode = fixCode(resultCode, fixLogger, proceduresMap, tree, extraFixers);
	return formatCode(fixedCode);
};