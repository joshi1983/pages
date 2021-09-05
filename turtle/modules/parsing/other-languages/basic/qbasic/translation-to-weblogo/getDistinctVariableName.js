export function getDistinctVariableName(prefix, options) {
	const identifierRenameMap = options.identifierRenameMap;
	if (!identifierRenameMap.has(prefix.toLowerCase()))
		return prefix;
	for (let suffix = 1; true ; suffix++) {
		const candidateName = prefix + suffix;
		if (!identifierRenameMap.has(candidateName.toLowerCase()))
			return candidateName;
	}
};