import { Highlighter } from '../../../../modules/components/syntax-highlighter/highlighters/Highlighter.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processPossibleToken } from '../../../../modules/components/syntax-highlighter/inner-text/processPossibleToken.js';

function testLineGroupParentNotChanging(logger) {
	const container = document.createElement('pre');
	const lineGroup = document.createElement('span');
	lineGroup.setAttribute('id', Highlighter.formatLineGroupID('test-process-possible-token', 0));
	lineGroup.innerHTML = '<span class="parameterized-group">fd</span> <span class="number-literal">4</span>';
	container.appendChild(lineGroup);
	const procNameSet = new Set();
	processPossibleToken(lineGroup, procNameSet);
	if (lineGroup.parentNode !== container)
		logger(`Expected lineGroup.parentNode to equal its original container but got null`);
}

export function testProcessPossibleToken(logger) {
	testLineGroupParentNotChanging(prefixWrapper('testLineGroupParentNotChanging', logger));
};