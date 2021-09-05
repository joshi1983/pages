export function genericProcessTo(migrationData) {
	const renameMap = new Map();
	for (const f of migrationData.functions) {
		if (typeof f.name === 'string' && f.to !== undefined &&
		f.to.toLowerCase() !== f.name.toLowerCase())
			renameMap.set(f.name.toLowerCase(), f.to);
	}
	return function(scanTokens) {
		for (let i = 0; i < scanTokens.length; i++) {
			const token = scanTokens[i];
			const newName = renameMap.get(token.s.toLowerCase());
			if (newName) {
				token.s = newName;
			}
		}
	};
};