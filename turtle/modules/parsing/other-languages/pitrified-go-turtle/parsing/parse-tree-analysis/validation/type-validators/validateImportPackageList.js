import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateImportPackageList(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.IMPORT)
		parseLogger.error(`Expected parent of IMPORT_PACKAGE_LIST to be an IMPORT but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length < 2)
		parseLogger.error(`Expected at least 2 children for IMPORT_PACKAGE_LIST but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`Expected first child of IMPORT_PACKAGE_LIST to be a CURVED_LEFT_BRACKET, '(', but found ${firstChild.val}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of IMPORT_PACKAGE_LIST to be a CURVED_RIGHT_BRACKET, ')', but found ${lastChild.val}`, token);
	}
};