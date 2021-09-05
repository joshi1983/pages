import { processToken } from '../processToken.js';

export function make(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const variableName = children[0].val;
	const valToken = children[1];
	if (valToken !== undefined &&
	typeof variableName === 'string') {
		const declarations = options.declarations.get(token);
		if (declarations !== undefined && declarations.length > 0) {
			result.append('\n' + declarations[0].keyword + ' ');
		}
		else
			result.append('\n');
		result.append(`${variableName} = `);
		processToken(valToken, result, options);
	}
};