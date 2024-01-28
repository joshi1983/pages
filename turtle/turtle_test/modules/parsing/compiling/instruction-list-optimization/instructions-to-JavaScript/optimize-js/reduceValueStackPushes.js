import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from
'../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDecreaseAmountFromToken } from './getDecreaseAmountFromToken.js';
import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from '../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isContextValueStackPushThroughAssignment } from './token-classifiers/isContextValueStackPushThroughAssignment.js';
import { isLastValueStackElementExpression } from './token-classifiers/isLastValueStackElementExpression.js';
import { isValueStackElement } from './token-classifiers/isValueStackElement.js';
import { isValueStackLengthUpdate } from './token-classifiers/isValueStackLengthUpdate.js';
import { isValueStackPop } from './token-classifiers/isValueStackPop.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { mightCauseSideEffects } from './token-classifiers/mightCauseSideEffects.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';
import { setValueStackDecreaseAmount } from './setValueStackDecreaseAmount.js';

const safeToMoveTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.NULL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNDEFINED,
]);

function isUnsafeForOptimizationDueToMutatingPushOrAssignment(token) {
	if (isValueStackPush(token) || isContextValueStackPushThroughAssignment(token))
		return true;
	/*
	Check if token mutates the length of context.valueStack like this:
	context.valueStack[context.valueStack.length - 0] = context.repcount();
	*/
	if (token.val === '=' && token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 2 &&
	isValueStackElement(token.children[0])) {
		const valToken = token.children[0].children[1].children[1];
		if (valToken.type !== ParseTreeTokenType.BINARY_OPERATOR)
			return true; // consider unsafe because we don't know.
			// It might be safe but we're not investigating deeply enough to be sure yet.

		if (valToken.type === ParseTreeTokenType.BINARY_OPERATOR && valToken.val === '-' &&
		valToken.children.length === 2) {
			const numToken = valToken.children[1];
			if (numToken.type === ParseTreeTokenType.NUMBER_LITERAL && parseInt(numToken.val) < 1)
				return true;
		}
	}
	return false;
}

function isSafeForOptimization(token) {
	if (isUnsafeForOptimizationDueToMutatingPushOrAssignment(token))
		return false;
	const allDescendents = getAllDescendentsAsArray(token);
	if (allDescendents.some(isUnsafeForOptimizationDueToMutatingPushOrAssignment))
		return false;
	if (!isValueStackPop(token) && !isValueStackLengthUpdate(token)) {
		if (allDescendents.some(t => isValueStackPop(t) ||
		isValueStackLengthUpdate(t)))
			return false;
	}
	return true;
}

function isValueStackEndingToken(token) {
	return isValueStackPop(token) ||
	isValueStackLengthUpdate(token);
}

function getNextPopIndex(children, pushIndex) {
	for (let index = pushIndex + 1; index < children.length;index++) {
		const child = children[index];
		if (!isSafeForOptimization(child))
			return;
		if (isAssigningToLastValueStackElement(child)) {
			for (let i = index + 1; i < children.length; i++) {
				const child2 = children[i];
				if (child2.type !== ParseTreeTokenType.SEMICOLON) {
					if (!isValueStackEndingToken(child2))
						return;
				}
			}
		}
		if (isValueStackEndingToken(child)) {
			return index;
		}
	}
}

function getLastPushValueToken(pushToken) {
	if (pushToken.type === ParseTreeTokenType.FUNCTION_CALL) {
		// For example, valueStack.push(1, 2, 3, 4);
		// return the "4" token.
		const argList = pushToken.children[1];
		return argList.children[argList.children.length - 2];
	}
	else {
		// For example, valueStack[valueStack.length - 0] = 4;
		// Return the "4" token.
		return pushToken.children[1];
	}
}

function isLastValuePushedSafeToMove(pushToken) {
	const lastValToken = getLastPushValueToken(pushToken);
	if (safeToMoveTypes.has(lastValToken.type))
		return true;
	return false;
}

function isOfInterest(token) {
	if (!isValueStackPush(token) && !isContextValueStackPushThroughAssignment(token)) {
		return false;
	}
	if (!isLastValuePushedSafeToMove(token))
		return false;
	const children = token.parentNode.children;
	let index = children.indexOf(token);
	const popIndex = getNextPopIndex(children, index);
	if (popIndex === undefined)
		return false;
	return true;
}

function removeLastPushedParameter(pushToken) {
	const lastValToken = getLastPushValueToken(pushToken);
	const argList = lastValToken.parentNode;
	const children = argList.children;
	const index = children.indexOf(lastValToken);
	if (index <= 1) {
		removeSemicolonsImmediatelyAfter(pushToken);
		pushToken.remove();
		return;
	}
	const prev = children[index - 1];
	if (prev.type === ParseTreeTokenType.COMMA)
		prev.remove();
	lastValToken.remove();
}

function isToBeReplaced(token) {
	if (isLastValueStackElementExpression(token)) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			return parent.children.indexOf(token) !== 0;
		}
		return true;
	}
	return false;
}

function isAssigningToLastValueStackElement(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && token.children.length === 2) {
		const leftOperand = token.children[0];
		if (isLastValueStackElementExpression(leftOperand)) {
			return true;
		}
	}
	return false;
}

function isToBeRemoved(token) {
	if (!isAssigningToLastValueStackElement(token))
		return false;
	const leftOperand = token.children[0];
	if (isLastValueStackElementExpression(leftOperand)) {
		const rightOperand = token.children[1];
		const allTokens = getDescendentsOfType(rightOperand);
		allTokens.push(rightOperand);
		return !allTokens.some(mightCauseSideEffects);
	}
	return false;
}

function replaceToken(oldToken, newToken) {
	const colOffset = oldToken.colIndex - newToken.colIndex;
	newToken = newToken.cloneWithDescendents();
	const allTokens = getAllDescendentsAsArray(newToken);
	allTokens.push(newToken);
	allTokens.forEach(function(tok) {
		tok.lineIndex = oldToken.lineIndex;
		tok.colIndex += colOffset;
	});
	removeSemicolonsImmediatelyAfter(oldToken);
	oldToken.parentNode.replaceChild(oldToken, newToken);
	oldToken.remove();
}

function decreaseElementIndex(token) {
	const indexExpression = token.children[1].children[1];
	for (let i = 0; i < indexExpression.children.length; i++) {
		const child = indexExpression.children[i];
		if (child.type === ParseTreeTokenType.NUMBER_LITERAL) {
			if (indexExpression.val === '-' && i === 1)
				child.val = '' + (parseInt(child.val) - 1);
			else if (indexExpression.val === '+')
				child.val = '' + (parseInt(child.val) + 1);
			return;
		}
	}
}

function processOptimization(pushToken) {
	const children = pushToken.parentNode.children;
	let index = children.indexOf(pushToken);
	let popIndex = getNextPopIndex(children, index);
	const popToken = children[popIndex];
	const decreaseAmount = getDecreaseAmountFromToken(popToken);
	const removedTokens = [];
	const valToken = getLastPushValueToken(pushToken);
	for (index++; index < popIndex; index++) {
		const child = children[index];
		if (isToBeRemoved(child)) {
			const oldLen = children.length;
			removeSemicolonsImmediatelyAfter(child);
			child.remove();
			const offset = children.length - oldLen;
			index += offset;
			popIndex += offset;
			continue;
		}
		const tokensToReplace = getAllDescendentsAsArray(child).filter(isToBeReplaced);
		tokensToReplace.forEach(function(tokenToReplace) {
			replaceToken(tokenToReplace, valToken);
		});
		const tokensToUpdate = getAllDescendentsAsArray(child).filter(isValueStackElement);
		tokensToUpdate.forEach(function(tokenToUpdate) {
			decreaseElementIndex(tokenToUpdate);
		});
	}
	setValueStackDecreaseAmount(popToken, decreaseAmount - 1, removedTokens);
	let semicolon = pushToken.getNextSibling();
	if (semicolon !== null && semicolon.type === ParseTreeTokenType.SEMICOLON)
		removeSemicolonsImmediatelyAfter(semicolon);
	removeLastPushedParameter(pushToken);
}

export function reduceValueStackPushes(jsCode) {
	// Repeat a few times to more thoroughly optimize.
	while (true) {
		const parseResult = parse(jsCode);
		const pushes = getDescendentsOfTypes(parseResult.root, [ParseTreeTokenType.ASSIGNMENT_OPERATOR, ParseTreeTokenType.FUNCTION_CALL]).
			filter(isOfInterest);
		if (pushes.length === 0)
			return jsCode;
		pushes.forEach(processOptimization);

		const allTokens = flatten(parseResult.root);
		jsCode = parseTreeTokensToCode(allTokens);
	}
	return jsCode;
};