import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { processToken } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processToken.js';
import { processTokens } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/processTokens.js';

const badRepeatArgCountTypes = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR,
]);

export function isRepeatApplicableTo(token) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	if (args.length !== 2)
		return false;

	const repeatCountArg = args[0];
	if (badRepeatArgCountTypes.has(repeatCountArg.type))
		return false;

	const funcArg = args[1];
	if (funcArg.type !== ParseTreeTokenType.FUNCTION &&
	funcArg.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const funcChildren = funcArg.children;
	if (funcArg.type === ParseTreeTokenType.FUNCTION) {
		if (funcChildren.length < 2)
			return false;
	}
	else {
		if (funcChildren.length !== 0)
			return false;
	}

	return true;
}

export function repeat(token, result, options) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	result.append('\nrepeat ');
	processToken(args[0], result, options);
	result.append(' [\n');
	const funcArg = args[1];
	if (funcArg.type === ParseTreeTokenType.FUNCTION) {
		const codeBlock = funcArg.children[funcArg.children.length - 1];
		processTokens(processToken, filterBracketsAndCommas(codeBlock.children), result, options);
	}
	else
		result.append(funcArg.val);
	result.append('\n]\n');
};