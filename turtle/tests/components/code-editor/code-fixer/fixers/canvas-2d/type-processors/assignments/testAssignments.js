import { testIsDocumentToken } from './testIsDocumentToken.js';
import { testShouldAssignmentBeRemoved } from './testShouldAssignmentBeRemoved.js';
import { testShouldDeclarationBeRemoved } from './testShouldDeclarationBeRemoved.js';
import { wrapAndCall } from '../../../../../../../helpers/wrapAndCall.js';

export function testAssignments(logger) {
	wrapAndCall([
		testIsDocumentToken,
		testShouldAssignmentBeRemoved,
		testShouldDeclarationBeRemoved
	], logger);
};