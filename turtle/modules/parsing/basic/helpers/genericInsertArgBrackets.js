import { Token } from
'../../generic-parsing-utilities/Token.js';

function hasNoArguments(info) {
	if (info.argCount !== undefined) {
		return info.argCount.max === 0;
	}
	else if (info.args !== undefined)
		return info.args.length === 0;
	return false;
}

export function genericInsertArgBrackets(scanTokens, getFunctionInfo) {
	if (!(scanTokens instanceof Array))
		throw new Error(`scanTokens must be an Array but found ${scanTokens}`);
	if (typeof getFunctionInfo !== 'function')
		throw new Error(`getFunctionInfo must be a function but found ${getFunctionInfo}`);

	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const info = getFunctionInfo(token.s);
		if (info !== undefined &&
		info.isStatement !== true &&
		!hasNoArguments(info) && (
		info.args !== undefined ||
		info.argCount !== undefined)) {
			const next = scanTokens[i + 1];
			if (next === undefined || next.s !== '(') {
				let len;
				if (next === undefined) {
					len = 1;
				}
				else if (next !== undefined) {
					let expectedCount;
					if (info.argCount !== undefined) {
						if (info.argCount.min === info.argCount.max)
							expectedCount = info.argCount.max;
					}
					else if (info.args !== undefined)
						expectedCount = info.args.length;
					let argIndex = 0;
					for (let offset = 1; true; offset++) {
						const argToken = scanTokens[i + offset];
						if (argToken === undefined || argToken.lineIndex !== token.lineIndex) {
							len = offset;
							break;
						}
						else if (argToken.s === ',') {
							argIndex++;
							if (argIndex >= expectedCount) {
								len = offset;
								break;
							}
						}
					}
				}
				if (Number.isInteger(len)) {
					scanTokens.splice(i + 1, 0, new Token('(',
						token.colIndex + 1, token.lineIndex));
					const index = Math.min(scanTokens.length - 1, i + len);
					const posToken = scanTokens[index];
					const closeBracket = new Token(')', posToken.colIndex + 1, posToken.lineIndex);
					if (index === scanTokens.length - 1)
						scanTokens.push(closeBracket);
					else
						scanTokens.splice(i + 1 + len, 0, closeBracket);
				}
			}
		}
	}
};