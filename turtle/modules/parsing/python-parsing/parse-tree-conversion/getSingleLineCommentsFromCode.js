import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function convertCommentInfoToParseTreeToken(info) {
	const val = info.value.substring(1);
	const lineIndex = info.lineNumber - 1;
	const colIndex = info.start;
	const originalString = info.value;
	const type = ParseTreeTokenType.SINGLE_LINE_COMMENT;
	return new ParseTreeToken(val, lineIndex, colIndex, type, originalString);
}

/*
The caller must await for parser.js's asyncInit() before calling getSingleLineCommentsFromCode.
*/
export function getSingleLineCommentsFromCode(code) {
	if (!code.endsWith('\n'))
		code += '\n'; // working around a bug where comments on the last line
	const result = PythonLexer(code);
	return result.filter(token => token.value.startsWith('#')).map(convertCommentInfoToParseTreeToken);
};