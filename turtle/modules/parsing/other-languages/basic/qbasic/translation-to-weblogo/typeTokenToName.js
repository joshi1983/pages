import { identifierToWebLogoIdentifier } from
'./type-processors/helpers/identifierToWebLogoIdentifier.js';

export function typeTokenToName(token, options) {
	const prefix = 'create' + identifierToWebLogoIdentifier(token.children[0].val);
	if (!options.identifierRenameMap.has(prefix.toLowerCase()))
		return prefix;
	for (let i = 1; true; i++) {
		const name = `${prefix}${i}`;
		if (!options.identifierRenameMap.has(name.toLowerCase()))
			return name;
	}
};