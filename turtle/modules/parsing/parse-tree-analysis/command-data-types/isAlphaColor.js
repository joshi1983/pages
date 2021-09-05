const alphaColorNames = new Set(['alphacolor', 'alphacolorlist', 'alphacolorlist|colorlist',
'alphacolorstring', 'color', 'colorlist', 'colorstring', 'int']);

export function isAlphaColor(type) {
	return alphaColorNames.has(type);
};