import { BufferedParseLogger } from '../../../../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from '../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/CachedParseTree.js';
import { parse } from '../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';

export function processTestCases(cases, validator, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const cachedParseTree = new CachedParseTree(parseResult.root);
		const parseLogger = new BufferedParseLogger();
		validator(cachedParseTree, parseLogger);
		if (parseLogger.hasLoggedErrors() !== caseInfo.error) {
			const div = document.createElement('div');
			div.innerText = `Expected error to be ${caseInfo.error} but found error of ${parseLogger.hasLoggedErrors()}`;
			if (parseLogger.getMessages().length !== 0) {
				div.innerText += 'The messages logged were: ';
				const ul = document.createElement('ul');
				parseLogger.getMessages().forEach(function(msg) {
					const li = document.createElement('li');
					li.innerText = msg.msg + ` (line ${msg.token.lineIndex})`;
					ul.appendChild(li);
				});
				div.appendChild(ul);
			}
			plogger(div);
		}
	});
};