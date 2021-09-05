import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { includeAllReferencedProcedures } from './includeAllReferencedProcedures.js';
import { parse } from '../parse.js';
import { processSingleLineCommentToken } from './type-processors/processSingleLineCommentToken.js';
import { processToken } from './processToken.js';
import { StringBuffer } from '../../../StringBuffer.js';

export function translate(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processSingleLineCommentToken);
	includeAllReferencedProcedures(parseResult.root, result);
	processToken(parseResult.root, result);
	result.processAllRemainingComments();
	return result.toString().trim();
};