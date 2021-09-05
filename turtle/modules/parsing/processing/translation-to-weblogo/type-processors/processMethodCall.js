import { Command } from
'../../../Command.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { methodCallTokenToArgTypes } from
'./method-calls/methodCallTokenToArgTypes.js';
import { methodCallTokenToClassName } from
'./method-calls/methodCallTokenToClassName.js';
import { processArgumentsAsSingleColor } from './method-calls/processArgumentsAsSingleColor.js';
import { ProcessingMethod } from '../../ProcessingMethod.js';
import { processSpecialMethodCall } from './method-calls/processSpecialMethodCall.js';
import { processToken } from './processToken.js';
await Command.asyncInit();

function getArgCount(methodInfo, argTokens) {
	let argCount1 = methodInfo.argCount;
	if (methodInfo.to !== undefined) {
		const info = Command.getCommandInfo(methodInfo.to);
		argCount1 = info.args.length;
	}
	if (argCount1 !== undefined &&
	methodInfo.ignoreExtraParameters === true &&
	argCount1 < argTokens.length)
		return argCount1;
	return argTokens.length;
}

export function processMethodCall(token, result, settings) {
	if (processSpecialMethodCall(token, result, settings))
		return;
	const children = token.children;
	if (children.length === 2) {
		const nameToken = children[0];
		const args = children[1];
		const argTokens = filterBracketsAndCommas(args.children);
		const argCount = argTokens.length;
		const className = methodCallTokenToClassName(token);
		const argTypes = methodCallTokenToArgTypes(token, settings.cachedParseTree);
		const methodInfo = ProcessingMethod.getMethodInfo(nameToken.val, className, argCount, argTypes);
		let numArgs = argCount;
		if (methodInfo === undefined)
			result.append(' ' + nameToken.val + ' ');
		else {
			// is methodInfo.to set?  
			// else is methodInfo.toProc set?
			const name = methodInfo.to !== undefined ? methodInfo.to : methodInfo.toProc;
			if (methodInfo.removeInMigration === true)
				return;
			else {
				if (name !== undefined) {
					result.append(' ' + name + ' ');
				}
				if (methodInfo.translateAllParametersToSingleColor === true) {
					processArgumentsAsSingleColor(argTokens, result, settings);
					return;
				}
				else {
					numArgs = getArgCount(methodInfo, argTokens);
				}
			}
		}
		for (let i = 0; i < numArgs; i++) {
			const child = argTokens[i];
			processToken(child, result, settings);
			result.append(' ');
		}
	}
};