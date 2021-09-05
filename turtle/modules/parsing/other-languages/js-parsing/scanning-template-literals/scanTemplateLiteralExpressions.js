import { isTemplateSymbolStart } from './isTemplateSymbolStart.js';
import { scan } from './scan.js';

function unwrapSymbol(s) {
	if (s.startsWith('${'))
		s = s.substring(2);
	if (s.endsWith('}'))
		s = s.substring(0, s.length - 1);
	return s;
}

export function scanTemplateLiteralExpressions(template) {
	const result = scan(template).map(tok => tok.s).filter(isTemplateSymbolStart).map(unwrapSymbol);
	return result;
};