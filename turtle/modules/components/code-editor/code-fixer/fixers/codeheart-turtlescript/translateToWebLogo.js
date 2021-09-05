import { addColourDeclarations } from './addColourDeclarations.js';
import { addProcedures } from './addProcedures.js';
import { CommentDumpingStringBuffer } from
'../../../../../parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixAndFormat } from '../../../../../parsing/js-parsing/translation-to-weblogo/fixAndFormat.js';
import { parse } from '../../../../../parsing/js-parsing/parse.js';
import { processJavaLikeCommentToken } from
'../../../../../parsing/generic-parsing-utilities/processJavaLikeCommentToken.js';
import { processToken } from './type-processors/processToken.js';

export function translateToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processJavaLikeCommentToken);
	addColourDeclarations(parseResult.root, result);
	result.append('setPenSize 0\nsetLineCap "round\n');
	processToken(parseResult.root, result);
	result.processAllRemainingComments();

	const withProcs = addProcedures(result.toString().trim());
	return fixAndFormat(withProcs);
};