import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { processHyperlinks } from '../processors/processHyperlinks.js';
import { StringBuffer } from '../../../StringBuffer.js';

export class LongStringHTMLTokenProcessor {
	static isApplicableTo(token) {
		return token.type === ParseTreeTokenType.LONG_STRING_LITERAL;
	}

	static toHTML(token) {
		const result = new StringBuffer();
		const lines = processHyperlinks(token.val).split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			// No need to add a span for the last line if the line is empty.
			if (i !== 0 && i === lines.length - 1 && line === '' && token.isComplete === false)
				break;
			result.append(`<span class="string-literal">`);
			if (i === 0)
				result.append("'");
			result.append(line);
			if (i === lines.length - 1 && token.isComplete)
				result.append("'");
			result.append('</span>');
			if (i !== lines.length - 1)
				result.append('\n');
		}
		return result.toString();
	}
};