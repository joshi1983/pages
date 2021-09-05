import { filterBracketsAndCommas } from
'../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { TurtleGraphicsFunFunctions } from
'../../TurtleGraphicsFunFunctions.js';

function tokenToFunctionInfo(token) {
	const children = token.children;
	const nameToken = children[0];
	const argList = filterBracketsAndCommas(children[1].children);
	const numArgs = argList.length;
	const info = TurtleGraphicsFunFunctions.getFunctionInfo(nameToken.val, numArgs);
	return info;
}

function isApplicableTo(token) {
	const info = tokenToFunctionInfo(token);
	if (info === undefined)
		return false;

	return info.removeInMigration !== undefined ||
		info.to !== undefined ||
		info.toProc !== undefined;
}

export function processFunctionCall(token, result, options) {
	const info = tokenToFunctionInfo(token);
	if (info.removeInMigration)
		return;

	result.append(' ');
	if (info.to !== undefined)
		result.append(info.to);
	else if (info.toProc !== undefined)
		result.append(info.toProc);
	result.append(' ');
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	let toArgCount = Number.MAX_SAFE_INTEGER;
	if (info.to !== undefined) {
		const commandInfo = Command.getCommandInfo(info.to);
		if (commandInfo.argCount !== undefined) {
			if (commandInfo.argCount.max !== undefined)
				toArgCount = commandInfo.argCount.max;
		}
		else if (commandInfo.args !== undefined)
			toArgCount = commandInfo.args.length;
	}
	const len = Math.min(args.length, toArgCount);
	for (let i = 0; i < len; i++) {
		processToken(args[i], result, options);
		result.append(' ');
	}
};