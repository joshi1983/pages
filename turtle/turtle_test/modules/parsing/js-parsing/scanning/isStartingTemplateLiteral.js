/*
Template literals are documented at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
*/
export function isStartingTemplateLiteral(s) {
	return s === '' ||
		s.charAt(0) === '`';
}