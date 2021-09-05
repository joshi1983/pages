import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

function getForSettingTokens(forToken) {
	const children = forToken.children;
	const assignmentToken = children[0];
	if (assignmentToken === undefined ||
	assignmentToken.children.length !== 2 ||
	assignmentToken.val !== '=')
		return;

	const leftOperand = assignmentToken.children[0];
	if (leftOperand.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	const variableName = leftOperand.val;
	const initialValueToken = assignmentToken.children[1];
	const finalValueToken = children[children.length - 1];
	let stepValueToken;
	if (children.length === 3) {
		stepValueToken = children[1];
	}
	return {
		'variableName': variableName,
		'initialValueToken': initialValueToken,
		'finalValueToken': finalValueToken,
		'stepValueToken': stepValueToken
	};
}

function processFor(forToken, result) {
	result.append('for [');
	const forSettingTokens = getForSettingTokens(forToken);
	if (forSettingTokens === undefined)
		processToken(forToken.children[0], result);
	else {
		result.append(`"${forSettingTokens.variableName} `);
		processToken(forSettingTokens.initialValueToken, result);
		result.append(' ');
		processToken(forSettingTokens.finalValueToken, result);
		if (forSettingTokens.stepValueToken !== undefined) {
			result.append(' ');
			processToken(forSettingTokens.stepValueToken, result);
		}
	}
	result.append('\n] [\n');
}

function processIf(ifToken, result) {
	result.append('if ');
	processToken(ifToken.children[0], result);
	result.append(' [\n');
}

function processWhile(whileToken, result) {
	result.append('while ');
	processToken(whileToken.children[0], result);
	result.append(' [\n');
}

const clauseProcessors = new Map([
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.WHILE, processWhile]
]);

function getCentralToken(token) {
	for (const child of token.children) {
		if (child.type !== ParseTreeTokenType.NUMBER_LITERAL &&
		!clauseProcessors.has(child.type))
			return child;
	}
}

function getClauseToken(token) {
	for (const child of token.children) {
		if (clauseProcessors.has(child.type) &&
		child.children.length !== 0)
			return child;
	}
}

export function processLineOfCode(token, result) {
	const clauseToken = getClauseToken(token);
	const centralToken = getCentralToken(token);
	if (clauseToken !== undefined) {
		const clauseProcessor = clauseProcessors.get(clauseToken.type);
		if (clauseProcessor !== undefined) {
			result.append('\n');
			clauseProcessor(clauseToken, result);
		}
	}
	if (centralToken !== undefined)
		processToken(centralToken, result);
	if (clauseToken !== undefined)
		result.append('\n]\n');
};