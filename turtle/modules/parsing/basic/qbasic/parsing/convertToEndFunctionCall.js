import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const newParentNeededTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function convertENDTokenToFunctionCall(endToken, codeBlock) {
	let parent = endToken.parentNode;
	if (newParentNeededTypes.has(parent.type)) {
		parent = new ParseTreeToken(null, endToken.lineIndex, endToken.colIndex, ParseTreeTokenType.FUNCTION_CALL);
		parent.appendChild(endToken);
	}
	else {
		parent.remove();
		parent.type = ParseTreeTokenType.FUNCTION_CALL;
	}
	codeBlock.appendChild(parent);
	endToken.type = ParseTreeTokenType.IDENTIFIER;
	const argList = new ParseTreeToken(null, endToken.lineIndex, endToken.colIndex, ParseTreeTokenType.ARG_LIST);
	parent.appendChild(argList);
}

// "end" is usually a keyword but let's treat it more like 
// a function or subroutine call in this special case.
export function convertToEndFunctionCall(endStatement, codeBlock) {
	if (codeBlock !== null &&
	codeBlock.type === ParseTreeTokenType.CODE_BLOCK) {
		if (endStatement.type === ParseTreeTokenType.END)
			convertENDTokenToFunctionCall(endStatement, codeBlock);
		else {
			const endToken = endStatement.children[0];
			convertENDTokenToFunctionCall(endToken, codeBlock);
		}
	}
};