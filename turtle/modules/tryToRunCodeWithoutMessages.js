import { Code } from './components/code-editor/Code.js';
import { ParseLogger } from './parsing/loggers/ParseLogger.js';
import { refreshAnimationSetupFromTree } from
'./components/code-editor/refreshAnimationSetupFromTree.js';

/*
This mainly intended to be run when WebLogo loads.
This hides any error messages and warnings.
The program doesn't run if any errors are found.
It will run if only warnings are found, though.
*/
export function tryToRunCodeWithoutMessages() {
	const parseLogger = new ParseLogger();
	Code.refreshProgram(parseLogger);
	if (!parseLogger.hasLoggedErrors()) { // if no quality problems found, run it.
		Code.run();
		// refresh the animation duration.
		if (Code.executer !== undefined &&
		Code.executer.executionContext !== undefined) {
			const tree = Code.executer.executionContext.logoProgram.parseTree;
			refreshAnimationSetupFromTree(tree);
		}
	}
};