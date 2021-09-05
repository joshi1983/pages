import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isBracketOrComma } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	let children = token.children;
	if (children.length !== 1)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	firstChild.val !== '=')
		return false;
	children = firstChild.children;
	if (children.length !== 2)
		return false;
	let leftOperand = children[0];
	if (leftOperand.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let rightOperand = children[1];
	if (rightOperand.type !== ParseTreeTokenType.FAT_ARROW)
		return false;
	children = rightOperand.children;
	if (children.length !== 2)
		return false;
	leftOperand = children[0];
	if (leftOperand.type !== ParseTreeTokenType.ARG_LIST &&
	leftOperand.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	leftOperand.type !== ParseTreeTokenType.IDENTIFIER &&
	leftOperand.type !== ParseTreeTokenType.TUPLE_LITERAL)
		return false;
	rightOperand = children[1];
	if (rightOperand.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	return true;
}

function convertToDef(valToken) {
	valToken.val = 'def';
	valToken.type = ParseTreeTokenType.DEF;
	const assignToken = valToken.children[0];
	const fatArrow = assignToken.children[1];
	let argList = fatArrow.children[0];
	if (argList.type === ParseTreeTokenType.IDENTIFIER) {
		const newArgList = new ParseTreeToken(null,
			argList.lineIndex, argList.colIndex,
			ParseTreeTokenType.ARG_LIST);
		fatArrow.replaceChild(argList, newArgList);
		argList.remove();
		const leftBracket = new ParseTreeToken('(',
			argList.lineIndex, argList.colIndex - 1,
			ParseTreeTokenType.CURVED_LEFT_BRACKET);
		const rightBracket = new ParseTreeToken(')',
			argList.lineIndex, argList.colIndex,
			ParseTreeTokenType.CURVED_RIGHT_BRACKET);
		newArgList.appendChild(leftBracket);
		newArgList.appendChild(argList);
		newArgList.appendChild(rightBracket);
	}
	else
		argList.type = ParseTreeTokenType.ARG_LIST;
	const codeBlock = fatArrow.children[1];
	assignToken.removeSingleToken();
	fatArrow.removeSingleToken();
	const children = codeBlock.children;
	if (children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET) {
		codeBlock.insertAsFirstChild(new ParseTreeToken('{',
			codeBlock.lineIndex, codeBlock.colIndex,
			ParseTreeTokenType.CURLY_LEFT_BRACKET));
	}
	const last = children[children.length - 1];
	if (last.type !==
	ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
		codeBlock.appendChild(new ParseTreeToken('}',
			last.lineIndex, last.colIndex,
			ParseTreeTokenType.CURLY_RIGHT_BRACKET));
	}
	for (let i = codeBlock.children.length - 1; i >= 0; i--) {
		const child = codeBlock.children[i];
		if (!isBracketOrComma(child)) {
			if (child.type !== ParseTreeTokenType.RETURN) {
				const returnToken = new ParseTreeToken('return',
					child.lineIndex, child.colIndex, ParseTreeTokenType.RETURN);
				codeBlock.replaceChild(child, returnToken);
				returnToken.appendChild(child);
			}
			break;
		}
	}
}

export function functionsToMethods(root) {
	const vals = getDescendentsOfType(root, 
		ParseTreeTokenType.VAL).filter(isOfInterest);
	vals.forEach(convertToDef);
	return vals.length !== 0;
};