import { callTokenToArgValueTokens } from
'../helpers/callTokenToArgValueTokens.js';

export function _title(token, result, options) {
	const args = callTokenToArgValueTokens(token);
	if (args.length === 1) {
		result.append('\n; Title: ');
		result.append(args[0].val);
		result.append('\n');
	}
};