export function encodeUrl(url) {
	// adapted from answer at:
	// https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
	return url.replace(/&/g, '&amp;')
		   .replace(/</g, '&lt;')
		   .replace(/>/g, '&gt;')
		   .replace(/"/g, '&quot;')
		   .replace(/'/g, '&apos;');
};