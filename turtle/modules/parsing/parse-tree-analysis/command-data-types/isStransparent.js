const stransparentTypes = new Set(['alphacolorstring', 'alphacolorstring|colorstring|transparent',
'alphacolorstring|transparent', 'colorstring', 'colorstring|transparent', 'string', 'string|transparent', 'transparent']);

/*
Checks if the corresponding values are a non-empty subset of string|transparent
*/
export function isStransparent(types) {
	return stransparentTypes.has(types);
};