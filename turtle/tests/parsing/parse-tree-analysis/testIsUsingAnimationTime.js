import { isUsingAnimationTime } from '../../../modules/parsing/parse-tree-analysis/isUsingAnimationTime.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testIsUsingAnimationTime(logger) {
	const cases = [
		{'code': '', 'result': false},
		{'code': 'fd 100', 'result': false},
		{'code': 'fd animation.time', 'result': true}
	];
	cases.forEach(function(caseInfo) {
		const code = caseInfo.code;
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		const result = isUsingAnimationTime(tree);
		if (result !== caseInfo.result)
			logger('Expected a result of ' + caseInfo.result + ' but got ' + result);
	});
};