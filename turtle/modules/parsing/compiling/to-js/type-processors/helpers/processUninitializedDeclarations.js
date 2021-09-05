export function processUninitializedDeclarations(token, result, options) {
	const declarations = options.declarations.get(token);
	if (declarations !== undefined) {
		for (const singleDeclaration of declarations) {
			result.append(`${singleDeclaration.keyword} ${singleDeclaration.name};\n`);
		}
	}
}