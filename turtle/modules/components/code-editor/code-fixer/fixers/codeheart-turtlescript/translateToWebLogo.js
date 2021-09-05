import { addColourDeclarations } from './addColourDeclarations.js';
import { addProcedures } from './addProcedures.js';
import { CommentDumpingStringBuffer } from '../../../../../parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixAndFormat } from './fixAndFormat.js';
import { parse } from '../../../../../parsing/js-parsing/parse.js';
import { processCommentToken } from './type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';

export function translateToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	addColourDeclarations(parseResult.root, result);
	result.append('setPenSize 0\nsetLineCap "round\n');
	processToken(parseResult.root, result);
	result.processAllRemainingComments();

	const withProcs = addProcedures(result.toString().trim());
	return fixAndFormat(withProcs);
};