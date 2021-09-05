import { getFilteredArgs } from
'./getFilteredArgs.js';
import { getMakeCommandNameForToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/getMakeCommandNameForToken.js';
import { ParseTreeTokenType } from
'../../../../qbasic/ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

export function isJoystApplicableTo(token) {
	const args = getFilteredArgs(token);
	if (args.length !== 3)
		return false;

	for (let i = 1; i <= 2; i++) {
		const arg = args[i];
		if (arg.type !== ParseTreeTokenType.IDENTIFIER ||
		arg.children.length !== 0)
			return false;
	}
	return true;
};

export function joyst(token, result, options) {
	const makeCommand = getMakeCommandNameForToken(token);
	const valueLiteral = valueToLiteralCode(0);
	const args = getFilteredArgs(token);
	result.append(`\n${makeCommand} "${args[1].val} ${valueLiteral}\n`);
	result.append(`${makeCommand} "${args[2].val} ${valueLiteral}\n`);
};