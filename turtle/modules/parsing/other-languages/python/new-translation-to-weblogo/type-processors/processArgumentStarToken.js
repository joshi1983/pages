export function processArgumentStarToken(token, result, cachedParseTree, settings) {
	const id = token.children[0].val;
	const webLogoId = settings.identifierToWebLogo.get(id);
	result.append(`:${webLogoId}`);
};