import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { evaluateTokenDataTypes } from
'../parsing/parse-tree-analysis/variable-data-types/evaluateTokenDataTypes.js';
import { formatCode } from
'../../../components/code-editor/format/formatCode.js';
import { getImportedPathsFrom  } from
'../parsing/parse-tree-analysis/getImportedPathsFrom.js';
import { getReferencedProcedures} from
'./getReferencedProcedures.js';
import { parse } from '../parsing/parse.js';
import { processComment } from './type-processors/processComment.js';
import { processToken } from './type-processors/processToken.js';

export function translatePitrifiedGoTurtleToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	const settings = {
		'imports': getImportedPathsFrom(parseResult.root),
	};
	settings.tokenDataTypes = evaluateTokenDataTypes(parseResult.root, settings);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();
	let resultCode = result.toString();
	const referencedProcedures = getReferencedProcedures(resultCode);
	if (referencedProcedures !== '') {
		resultCode = referencedProcedures + resultCode;
	}
	return formatCode(resultCode);
};