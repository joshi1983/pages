import { BufferedParseLogger } from '../../../../../parsing/loggers/BufferedParseLogger.js';
import { clashingProcedureNameFixer } from '../clashingProcedureNameFixer.js';
import { convertToJumpCommandFixer } from '../convertToJumpCommandFixer.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from '../../../format/formatCode.js';
import { jumpFixer } from '../jumpFixer.js';
import { penUpPenDownRemoveFixer } from '../penUpPenDownRemoveFixer.js';
import { polyFixer } from '../polyFixer.js';
import { wrappedFix } from '../../wrappedFix.js';

/*
The following list of fixers was important for fixing all the errors found 
with the example Codeheart TurtleScript programs.

Autofix runs lots more fixers and the user can run all of those.
This is a smaller list because I want to let the user potentially 
review some of the messages and play a more active role in migrating the code.
Running every fixer available automatically would take that opportunity to 
review the translation process away.
*/
const fixers = [
clashingProcedureNameFixer,
convertToJumpCommandFixer,
jumpFixer,
penUpPenDownRemoveFixer,
polyFixer
];
const hardLimit = 10; 
// a limit to avoid a potential infinite loop.

function fixersChain(cachedParseTree, fixLogger) {
	// Run the fixes repeatedly until no new messages are made or until 
	// the number of iterations is likely in an infinite loop.
	for (let i = 0; i < hardLimit; i++) {
		let numMessages = fixLogger.parseLogger.getMessages().length;
		for (const fixer of fixers) {
			fixer(cachedParseTree, fixLogger);
		}
		if (fixLogger.parseLogger.getMessages().length === numMessages)
			break;
	}
}

function fix(code) {
	const parseLogger = new BufferedParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = new Map();
	const tree = undefined;
	return wrappedFix(code, fixersChain, fixLogger, proceduresMap, tree)
}

export function fixAndFormat(webLogoCode) {
	webLogoCode = fix(webLogoCode);

	return formatCode(webLogoCode);
};