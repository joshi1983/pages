import { Command } from
'../../../../../parsing/Command.js';
import { Token } from
'../../../../../parsing/Token.js';
await Command.asyncInit();

const commandsOfInterest = new Set();
Command.getAllCommandsInfo().forEach(function(commandInfo) {
	if (commandInfo.args.length === 1) {
		const argInfo = commandInfo.args[0];
		const types = argInfo.types;
		if (types.indexOf('color') === -1)
			return;

		commandsOfInterest.add(commandInfo.primaryName.toLowerCase());
	}
});

function mightBeByteValue(s) {
	if (s[0] === ':')
		return true;
	if (':[]();'.indexOf(s[0]) !== -1)
		return false;
	if (!isNaN(s)) {
		const num = parseFloat(s);
		if (!Number.isInteger(num))
			return false;
		if (num > 255 || num < 0)
			return false;
		return true;
	}

	const info = Command.getCommandInfo(s.toLowerCase());
	if (info !== undefined) {
		const returnTypes = info.returnTypes;
		if (returnTypes === null)
			return false;

		if (returnTypes.indexOf('num') === -1 &&
		returnTypes.indexOf('int') === -1)
			return false;

		const argCount = Command.getArgCount(info);
		if (argCount.defaultCount !== 0)
			return false;
		if (argCount.max !== undefined && argCount.max !== 0)
			return false;

		return true;
	}
	return false;
}

function mayNext3TokensEvaluateToIntegers(scanTokens, i) {
	for (let j = 1; j <= 3; j++) {
		const token = scanTokens[i + j];
		if (token === undefined || !mightBeByteValue(token.s))
			return false;
	}
	return true;
}

function intTo2DigitHex(i) {
	let result = i.toString(16);
	if (result.length === 1)
		result = '0' + result;

	return result.toLowerCase();
}

function getHexStringFromRGBLiterals(scanTokens, i) {
	let vals = [];
	for (let j = 1; j <= 3; j++) {
		const val = parseInt(scanTokens[i + j].s);
		if (isNaN(val))
			return;

		vals.push(val);
	}
	return '"#' + vals.map(intTo2DigitHex).join('');
}

export function processRGBParameters(scanTokens) {
	for (let i = 0; i < scanTokens.length - 3; i++) {
		const scanToken = scanTokens[i];
		if (commandsOfInterest.has(scanToken.s.toLowerCase()) &&
		mayNext3TokensEvaluateToIntegers(scanTokens, i)) {
			const hexString = getHexStringFromRGBLiterals(scanTokens, i);
			if (hexString !== undefined) {
				scanTokens[i + 1].s = hexString;
				scanTokens.splice(i + 2, 2); // remove the 2 extra tokens.
			}
			else {
				// wrap the 3 tokens with [ ].
				const tokensToWrap = [scanTokens[i + 1], scanTokens[i + 2], scanTokens[i + 3]];
				let colIndex = scanTokens[i].colIndex + 1;
				let lineIndex = scanTokens[i].lineIndex;
				const openBracket = new Token('[', colIndex, lineIndex);
				colIndex = scanTokens[i + 3].colIndex + 1;
				lineIndex = scanTokens[i + 3].lineIndex;
				const closeBracket = new Token(']', colIndex, lineIndex);

				// insert the brackets.
				scanTokens.splice(i + 1, 3, openBracket, ...tokensToWrap, closeBracket);
			}
		}
	}
};