import { StringBuffer } from '../../StringBuffer.js';

/*
Evaluates a string template.
Any template symbols are evaluated by calling the specified valueGetter function.
The JavaScript expression in the template symbol is passed to valueGetter.

If we run into bugs with this, consider reusing: scanning-template-literals/scan.js.
That can be adapted to handle lots of unusual and complex cases.
*/
export function evaluateTemplateLiteral(template, valueGetter) {
	const result = new StringBuffer();
	for (let index = 0; index < template.length; index++) {
		const ch = template[index];
		if ((index === 0 || index === template.length - 1) && ch === '`')
			continue;
		if (ch === '$' && template[index + 1] === '{') {
			const indexEnd = template.indexOf('}', index);
			if (indexEnd === -1)
				break;
			const expression = template.substring(index, indexEnd - index);
			const val = valueGetter(expression);
			result.append('' + val);
			index = indexEnd;
		} else
			result.append(ch);
	}
	return result.toString();
};