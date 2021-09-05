import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { parse } from '../parsing/parse.js';
import { processComment } from './type-processors/processComment.js';
import { processTreeRoot } from './type-processors/processTreeRoot.js';

export function translateJossToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processComment);
	processTreeRoot(parseResult.root, result);
	result.processAllRemainingComments();
	const translatedCode = result.toString();
	return formatCode(translatedCode);
};