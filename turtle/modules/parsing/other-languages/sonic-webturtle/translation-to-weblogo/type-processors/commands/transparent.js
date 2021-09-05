import { processToken } from '../processToken.js';

export function transparent(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		if (child.val.startsWith('+')) {
			result.append(`webTurtleTransparentIncrease ${child.val.substring(1)}`);
		}
		else {
			result.append(`webTurtleTransparent `);
			processToken(child, result, settings);
		}
	}
	else {
		result.append('; Unable to translate call to transparent.\n');
		result.append(`; Expected 1 parameter but found ${token.children.length}\n`);
	}
};