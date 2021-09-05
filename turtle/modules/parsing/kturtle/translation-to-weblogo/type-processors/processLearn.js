import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getNameToken(learnToken) {
	// Normally, learnToken.children[0] should be the name token.
	// We're checking more of them in case the kturtle code is invalid.
	for (let i = 0; i < learnToken.children.length; i++) {
		const child = learnToken.children[i];
		if (child.type === ParseTreeTokenType.IDENTIFIER)
			return child;
	}
}

function getParametersParent(learnToken) {
	let t = learnToken.children[1];
	if (t !== undefined && t.type === ParseTreeTokenType.PARAMETERS_PARENT)
		return t; // normal case

	// looking at other child tokens in case the kturtle input code was invalid 
	// and this helps correct the problem.
	for (let i = 0; i < learnToken.children.length; i++) {
		const child = learnToken.children[i];
		if (child.type === ParseTreeTokenType.PARAMETERS_PARENT)
			return child;
	}
}

function getCodeBlock(token) {
	for (let i = token.children.length - 1; i >= 0; i--) {
		const child = token.children[i];
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
}

export function processLearn(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 0) {
		// very weird case but we want to handle it as well as possible anyway.
		result.append('to p\nend');
		return;
	}
	const nameToken = getNameToken(token);
	const paramsParent = getParametersParent(token);
	const codeBlock = getCodeBlock(token);
	result.append('to ');
	if (nameToken !== undefined)
		result.append(nameToken.val);
	else
		result.append('p');
	if (paramsParent !== undefined) {
		paramsParent.children.forEach(function(paramToken) {
			if (paramToken.type !== ParseTreeTokenType.COMMA) {
				processToken(paramToken, result);
				result.append(' ');
			}
		});
		result.trimRight();
	}
	if (codeBlock !== undefined) {
		processToken(codeBlock, result);
	}
	result.trimRight();
	result.append('\nend\n');
};