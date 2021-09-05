const stransparentTypes = new Set(['alphacolorstring', 'alphacolorstring|colorstring|transparent',
'alphacolorstring|transparent', 'colorstring', 'colorstring|transparent', 'string', 'string|transparent']);

export function isStransparent(types) {
	return stransparentTypes.has(types);
};