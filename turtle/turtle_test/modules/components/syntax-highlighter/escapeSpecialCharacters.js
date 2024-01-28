import { StringBuffer } from '../../StringBuffer.js';

const charsToReplace = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

export function escapeSpecialCharacters(codeSnippet) {
	/*
	Using StringBuffer instead of the built-in string here for performance.
	The StringBuffer might perform better if we would otherwise be adding single 
	characters to the end of a large resulting string repeatedly.
	*/
	const result = new StringBuffer(20);
	for (let i = 0; i < codeSnippet.length; i++) {
		const ch = codeSnippet.charAt(i);
		const replacement = charsToReplace[ch];
		if (replacement === undefined)
			result.append(ch);
		else
			result.append(replacement);
	}
	return result.toString();
}