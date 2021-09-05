import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isBracketOrComma } from
'../type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function getFirstNonBracket(tokens) {
	for (const child of tokens) {
		if (!isBracketOrComma(child))
			return child;
	}
}

function getAssignmentOperators(forLoopSettings) {
	return forLoopSettings.children.filter(t => t.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR);
}

function mightReadAVariable(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.CLASS ||
	parent.type === ParseTreeTokenType.DEF)
		return false;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		if (parent.children[0] !== token)
			return false;
	}
	return true;
}

function mightBeRead(varName, codeBlock) {
	const identifiers = getDescendentsOfType(codeBlock, ParseTreeTokenType.IDENTIFIER);
	return identifiers.filter(t => t.val === varName).some(mightReadAVariable);
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
		return false;
	const operators = getAssignmentOperators(firstChild);
	if (operators.length !== 1)
		return false;
	const operator = operators[0];
	if (operator.val !== '<-' || operator.children.length !== 2)
		return false;
	const leftOperand = operator.children[0];
	if (leftOperand.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const codeBlock = token.children[1];
	if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	return true;
}

export function forToRepeatFor(root) {
	const fors = getDescendentsOfType(root, ParseTreeTokenType.FOR).filter(isOfInterest);
	fors.forEach(function(forToken) {
		const firstChild = forToken.children[0];
		const codeBlock = forToken.children[1];
		let leftBracket = firstChild.children[0];
		let rightBracket = firstChild.children[firstChild.children.length - 1];

		// In the rare case some brackets are missing,
		// create appropriate replacements for them.
		if (leftBracket.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			leftBracket = new ParseTreeToken('(', leftBracket.lineIndex, leftBracket.colIndex,
				ParseTreeTokenType.CURVED_LEFT_BRACKET);
		}
		if (rightBracket.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
			rightBracket = new ParseTreeToken(')', rightBracket.lineIndex, rightBracket.colIndex,
				ParseTreeTokenType.CURVED_RIGHT_BRACKET);
		}
		const assignments = getAssignmentOperators(firstChild);
		const assignment = assignments[0];
		const leftOperand = assignment.children[0];
		const rightOperand = assignment.children[1];
		forToken.type = ParseTreeTokenType.FUNC_CALL;
		forToken.val = null;
		firstChild.val = 'repeatFor';
		firstChild.type = ParseTreeTokenType.IDENTIFIER;
		firstChild.removeAllChildren();
		const argList = new ParseTreeToken(null, firstChild.lineIndex, firstChild.colIndex,
			ParseTreeTokenType.ARG_LIST);
		argList.appendChild(leftBracket);
		argList.appendChild(rightOperand);
		argList.appendChild(rightBracket);
		codeBlock.remove();
		forToken.appendChild(argList);
		forToken.appendChild(codeBlock);

		if (mightBeRead(leftOperand.val, codeBlock)) {
			const firstChild = codeBlock.children[0];
			const child = getFirstNonBracket(codeBlock.children);
			const fatArrow = new ParseTreeToken('=>', firstChild.lineIndex, firstChild.colIndex + 1,
				ParseTreeTokenType.FAT_ARROW);
			leftOperand.remove();
			fatArrow.appendChild(leftOperand);
			codeBlock.replaceChild(child, fatArrow);
			fatArrow.appendChild(child);
		}
	});
	return fors.length !== 0;
};