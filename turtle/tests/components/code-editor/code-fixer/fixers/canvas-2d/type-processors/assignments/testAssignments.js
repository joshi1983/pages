import { testIsDocumentToken } from './testIsDocumentToken.js';
import { testProperties } from './properties/testProperties.js';
import { testShouldAssignmentBeRemoved } from './testShouldAssignmentBeRemoved.js';
import { testShouldDeclarationBeRemoved } from './testShouldDeclarationBeRemoved.js';
import { wrapAndCall } from '../../../../../../../helpers/wrapAndCall.js';

export function testAssignments(logger) {
	wrapAndCall([
		testIsDocumentToken,
		testProperties,
		testShouldAssignmentBeRemoved,
		testShouldDeclarationBeRemoved
	], logger);
};