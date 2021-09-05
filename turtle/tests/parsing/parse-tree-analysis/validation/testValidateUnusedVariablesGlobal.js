import { BufferedParseLogger } from '../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
import { validateUnusedVariables } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateUnusedVariables.js';

function testGlobalCase1(logger) {
	const code = `to p1
	maKe "X 0
end

to p2
	mAke "x 0
	Make "x :x + 4
end`;
	const tree = getCachedParseTreeFromCode(code, logger);
	const allTokens = tree.getAllTokens();
	const parseLogger = new BufferedParseLogger();
	validateUnusedVariables(tree, parseLogger);
	const mAkeToken = findToken({
		'val': 'mAke'
	}, allTokens, logger);
	const messages = parseLogger._messages.filter(m => m.token === mAkeToken);
	if (messages.length !== 0)
		logger(`Expected there to be no messages for mAke command but got ${messages.length}`);
}

export function testValidateUnusedVariablesGlobal(logger) {
	wrapAndCall([
		testGlobalCase1
	], logger);
};