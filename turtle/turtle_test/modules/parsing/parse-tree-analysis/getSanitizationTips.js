import { AlphaColour } from '../../AlphaColour.js';
import { Colour } from '../../Colour.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getSanitizationTips(token, typesStr) {
	if (token.isStringLiteral()) {
		if (token.val.toLowerCase().startsWith('transp') && typesStr.indexOf('transparent') !== -1) {
			return ` If you want to express transparent, remove the quote to call the transparent command.`;
		}
		else if (typesStr === 'boolean' && token.type === ParseTreeTokenType.STRING_LITERAL &&
		(token.val.toLowerCase() === 'true' || token.val.toLowerCase() === 'false')) {
			return ` Try removing the quote like ${token.val} instead of "${token.val}.`;
		}
		else if (typesStr === 'color') {
			const tips = Colour.getSanitizationTips(token.val);
			if (tips !== undefined)
				return ' ' + tips;
		}
		else if (typesStr.indexOf('alphacolor') !== -1) {
			const tips = AlphaColour.getSanitizationTips(token.val);
			if (tips !== undefined)
				return ' ' + tips;
		}
	}
	if (typesStr === 'instructionlist') {
		if (token.type !== ParseTreeTokenType.LIST)
			return '  An instruction list starts with an opening square bracket [';
	}
	return '';
};