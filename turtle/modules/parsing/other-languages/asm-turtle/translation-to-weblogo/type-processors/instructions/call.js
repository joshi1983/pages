export function call(token, result, settings) {
	if (token.children.length === 1) {
		const name = token.children[0].val.toLowerCase();
		let toName = settings.procedureRenameMap.get(name);
		if (toName === undefined)
			toName = name.replaceAll('@', '');
		result.append(toName);
	}
	else {
		result.append(`;FIXME: still need to translate call instruction because 1 operand was expected but ${token.children.length} was found`);
	}
};