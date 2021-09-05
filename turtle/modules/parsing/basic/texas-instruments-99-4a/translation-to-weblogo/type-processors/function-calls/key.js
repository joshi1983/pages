import { getFilteredArgs } from
'./getFilteredArgs.js';
import { getMakeCommandNameForToken } from
'../../../../qbasic/translation-to-weblogo/type-processors/helpers/getMakeCommandNameForToken.js';
import { ParseTreeTokenType } from
'../../../../qbasic/ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

export function isKeyApplicableTo(token) {
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

export function key(token, result, options) {
	const makeCommand = getMakeCommandNameForToken(token);
	const args = getFilteredArgs(token);
	result.append(`\n${makeCommand} "${args[1].val} ${valueToLiteralCode(0)}\n`); // the key code.
	result.append(`${makeCommand} "${args[2].val} ${valueToLiteralCode(0)}\n`); // status. 0 for no key pressed.
};