const lineCapNamesMap = new Map([
	['butt', 0],
	['round', 1],
	['square', 2]
]);

export function toPostScriptLineCap(name) {
	if (lineCapNamesMap.has(name))
		return lineCapNamesMap.get(name);
	else
		return 0;
};