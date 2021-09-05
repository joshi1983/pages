export function jumpToLabelName(jump) {
	if (jump.children.length !== 0) {
		let result = jump.children[0].val.toLowerCase();
		if (!result.startsWith('@@'))
			result = '@' + result;
		return result;
	}
};