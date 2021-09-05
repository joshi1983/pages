export function getDistinctVariableName(prefix, takenNames) {
	if (!takenNames.has(prefix))
		return prefix;
	for (let i = 1; true; i++) {
		const newName = prefix + i;
		if (!takenNames.has(newName))
			return newName;
	}
};