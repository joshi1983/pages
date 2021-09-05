import { genericProcessToken } from
'../../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArrow } from './processArrow.js';
import { processAssignment } from './processAssignment.js';
import { processCommandSymbol } from './processCommandSymbol.js';
import { processIdentifier } from './processIdentifier.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processTreeRoot } from './processTreeRoot.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARROW, processArrow],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.COMMAND_SYMBOL, processCommandSymbol],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.TREE_ROOT, processTreeRoot],
]);

const processToken = genericProcessToken(typeProcessors);

export { processToken };
