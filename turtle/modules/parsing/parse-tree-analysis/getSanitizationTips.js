import { Colour } from '../../Colour.js';

export function getSanitizationTips(token, typesStr) {
	if (typesStr === 'color' && token.isStringLiteral()) {
		const tips = Colour.getSanitizationTips(token.val);
		if (tips !== undefined)
			return ' ' + tips;
	}
	return '';
};