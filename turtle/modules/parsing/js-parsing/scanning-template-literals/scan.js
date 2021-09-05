import { isTemplateSymbolStart } from './isTemplateSymbolStart.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

export function scan(template) {
	const result = [];
	let token = '';
	let lineIndex = 0, colIndex = 0;
	function pushToken() {
		if (token !== '') {
			result.push(new Token(token, colIndex, lineIndex));
		}
	}

	for (let index = 0; index < template.length; index++) {
		const ch = template[index];
		if ((index === 0 || index === template.length - 1) && ch === '`') {
			colIndex++;
			continue;
		}
		if (!isTemplateSymbolStart(token) && ch === '$' && template[index + 1] === '{') {
			pushToken();
			token = '${';
			index++;
		}
		else if (ch === '}' && isTemplateSymbolStart(token)) {
			token += '}';
			pushToken();
			token = '';
		}
		else
			token += ch;
		if (ch === '\n') {
			colIndex = 0;
			lineIndex++;
		}
		else {
			colIndex++;
		}
	}
	if (token !== '')
		pushToken();
	return result;
};