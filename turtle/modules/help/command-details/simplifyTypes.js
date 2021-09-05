export function simplifyTypes(types) {
	const index = types.indexOf('<');
	if (index === -1)
		return types;
	else
		return types.substring(0, index);
};