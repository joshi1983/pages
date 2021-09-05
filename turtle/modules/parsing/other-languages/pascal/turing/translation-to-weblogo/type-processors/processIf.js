import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getAppropriateCommand(token) {
	if (token.children.some(c => c.type === ParseTreeTokenType.ELSE ||
	c.type === ParseTreeTokenType.ELSIF))
		return 'ifelse';
	else
		return 'if';
}

function getRootCodeBlock(token) {
	for (const c of token.children)
		if (c.type === ParseTreeTokenType.CODE_BLOCK)
			return c;
}

function getElsePartsOfInterest(ifToken) {
	const children = ifToken.children;
	const result = [];
	for (let i = 3; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.ELSE ||
		child.type === ParseTreeTokenType.ELSIF)
			result.push(child);
	}
	return result;
}

function getCodeBlock(part) {
	const children = part.children;
	for (const child of children) {
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
}

function getConditionToken(part) {
	const children = part.children;
	const firstChild = children[0];
	if (firstChild !== undefined &&
	firstChild.type !== ParseTreeTokenType.CODE_BLOCK &&
	firstChild.type !== ParseTreeTokenType.THEN)
		return firstChild;
}

function getCommandNameForPart(part, condition, codeBlock, remainingPartCount) {
	if (condition === undefined)
		return;

	if (remainingPartCount > 1)
		return 'ifelse';
	else
		return 'if';
}

export function processIf(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length !== 0) {
		const conditionToken = children[0];
		const ifCommand = getAppropriateCommand(token);
		result.append(`\n${ifCommand} `);
		processToken(conditionToken, result);
		result.append(' [\n');
		const codeBlock = getRootCodeBlock(token);
		if (codeBlock !== undefined) {
			processToken(codeBlock, result);
		}
		result.append('\n]\n');
		if (ifCommand === 'ifelse') {
			result.append(' [\n');
			
			// loop through all the elsif's.
			let level = 0;
			const parts = getElsePartsOfInterest(token);
			for (let j = 0; j < parts.length; j++) {
				const part = parts[j];
				const condition = getConditionToken(part);
				const codeBlock = getCodeBlock(part);
				let ifCommand = getCommandNameForPart(part, condition, codeBlock, parts.length - j);
				if (ifCommand === undefined) {
					if (codeBlock !== undefined)
						processToken(codeBlock, result);					
				}
				else if (ifCommand !== undefined) {
					result.append(`\n${ifCommand} `);
					processToken(condition, result);
					result.append(' [\n');
					if (codeBlock !== undefined)
						processToken(codeBlock, result);

					result.append('\n]');
					if (ifCommand === 'ifelse') {
						result.append(' [\n');
						level++;
					}
				}
			}
			result.append('\n]'.repeat(level));
			
			result.append('\n]\n');
		}
	}
};