import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixAndFormat } from './fixAndFormat.js';
import { parse } from '../parse.js';
import { processJavaLikeCommentToken } from
'../../generic-parsing-utilities/processJavaLikeCommentToken.js';
import { processJavaScriptGeneralToken } from
'./type-processors/processJavaScriptGeneralToken.js';

let p = function() {};
const minimalProcessToken = function() {
	p(...arguments);
};
const processToken = processJavaScriptGeneralToken(minimalProcessToken);
p = processToken;

export function translateToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processJavaLikeCommentToken);
	processToken(parseResult.root, result);
	result.processAllRemainingComments();

	return fixAndFormat(result.toString());
};