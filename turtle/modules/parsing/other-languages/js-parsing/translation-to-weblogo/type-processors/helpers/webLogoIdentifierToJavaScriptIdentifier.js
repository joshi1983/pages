export function webLogoIdentifierToJavaScriptIdentifier(id) {
	id = id.replace(/\./g, '');
	while (/\d/.test(id[0]))
		id = id.substring(1);
	if (id === '')
		id = '_';
	return id;
};