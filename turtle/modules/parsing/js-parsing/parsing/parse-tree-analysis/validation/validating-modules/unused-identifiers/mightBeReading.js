import { isFromExportStatement } from './isFromExportStatement.js';
import { isIdentifierFromClassName } from './isIdentifierFromClassName.js';
import { isIdentifierFromFunctionName } from './isIdentifierFromFunctionName.js';
import { isIdentifierFromImport } from './isIdentifierFromImport.js';
import { isIdentifierFromVariableDeclaration } from './isIdentifierFromVariableDeclaration.js';

const notReadingFuncs = [
	isIdentifierFromClassName,
	isIdentifierFromFunctionName,
	isIdentifierFromImport,
	isIdentifierFromVariableDeclaration
];

export function mightBeReading(token) {
	if (isFromExportStatement(token))
		return true;
	for (const notReadingFunc of notReadingFuncs) {
		if (notReadingFunc(token))
			return false;
	}
	return true;
};