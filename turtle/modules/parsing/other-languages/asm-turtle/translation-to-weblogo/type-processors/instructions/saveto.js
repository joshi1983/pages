export function saveto(token, result, settings) {
	if (token.children.length === 1) {
		result.append(`make "${token.children[0].val} :${settings.registerName}`);
	}
	else {
		result.append(';FIXME: unable to tranlsate saveto instruction\n');
	}
};