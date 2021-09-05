import { CommentDumpingStringBuffer } from
'../../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixWebLogoCode } from
'./fixWebLogoCode.js';
import { formatCode } from
'../../../../../components/code-editor/format/formatCode.js';
import { parse } from
'../parsing/parse.js';
import { processCommentToken } from
'./type-processors/processCommentToken.js';
import { processToken } from
'./type-processors/processToken.js';

export function translateTuringToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	processToken(parseResult.root, result);
	const translated = fixWebLogoCode(result.toString().trim());
	const formatted = formatCode(translated);
	return formatted.trim();
};