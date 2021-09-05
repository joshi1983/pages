import { getColourNameReferencesFromParseTree } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/getColourNameReferencesFromParseTree.js';
import { parse } from '../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';

export function testGetColourNameReferencesFromParseTree(logger) {
	const cases = [
	{'code': 'fd(100);', 'outLen': 0}, 
	// no colour referenced so nothing to declare.
	{'code': 'pencolor(RED);', 'outLen': 0}, 
	// RED is recognized by WebLogo so no declaration needed.
	{'code': 'pencolor(BABY_BLUE);', 'outLen': 1}, // BABY_BLUE is not recognized by WebLogo.
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const result = getColourNameReferencesFromParseTree(parseResult.root);
		if (result.size !== caseInfo.outLen)
			plogger(`Expected size to be ${caseInfo.outLen} but got ${result.size}`);
	});
};