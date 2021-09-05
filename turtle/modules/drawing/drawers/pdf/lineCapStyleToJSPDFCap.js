const translationMap = {
	'round': 1,
	'butt': 2,
	'square': 0
};

export function lineCapStyleToJSPDFCap(lineCapStyle) {
	if (translationMap[lineCapStyle] !== undefined)
		return translationMap[lineCapStyle];
	return 0;
};