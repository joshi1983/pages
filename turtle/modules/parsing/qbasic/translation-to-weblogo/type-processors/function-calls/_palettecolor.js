import { callTokenToArgValueTokens } from
'../helpers/callTokenToArgValueTokens.js';
import { processTokens } from '../helpers/processTokens.js';

function shouldBeTranslated(token, options) {
	const args = callTokenToArgValueTokens(token);
	if (args.length >= 3)
		return false;
	if (options.ignoreScreenCalls === true)
		return false;
	return true;
}

export function getToName(token, options) {
	if (shouldBeTranslated(token, options))
		return '_palettecolor_2';
};

export function _palettecolor(token, result, options) {
	const name = getToName(token, options);
	if (name !== undefined) {
		result.append(`\n${name} `);
		const args = callTokenToArgValueTokens(token);
		processTokens(args, result, options);
	}
};