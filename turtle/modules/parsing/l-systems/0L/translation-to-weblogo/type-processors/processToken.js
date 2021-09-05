import { genericProcessToken } from
'../../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArrow } from './processArrow.js';
import { processAssignment } from './processAssignment.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processTreeRoot } from './processTreeRoot.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARROW, processArrow],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.TREE_ROOT, processTreeRoot],
]);

const processToken = genericProcessToken(typeProcessors);

export { processToken };
