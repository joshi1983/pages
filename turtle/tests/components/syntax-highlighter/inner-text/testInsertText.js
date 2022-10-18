import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { Highlighter } from '../../../../modules/components/syntax-highlighter/highlighters/Highlighter.js';
import { insertText } from '../../../../modules/components/syntax-highlighter/inner-text/insertText.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { simplifyHTML } from '../simplifyHTML.js';

export function testInsertText(logger) {
	const cases = [
		/*{'inHTML': '', 'index': 0, 'newText': 'h', 'outHTML': 'h'},
		{
			'inHTML': '',
			'index': 0,
			'newText': 'to p',
			'outHTML': '<span class="keyword">to</span> <span class="procedure-name">p</span>'
		},
		{'inHTML': '<span class="string-literal">"he</span>',
			'index': 3,
			'newText': 'llo',
			'outHTML': '<span class="string-literal">"hello</span>'
		},
		{'inHTML': '<span class="number-literal" id="set-inner-text-test-0-3">4</span>', 
			'index': 1, 'newText': '\n',
			'outHTML': '<span class="number-literal">4</span>\n'
		},
		{'inHTML': '<span class="comment">;</span>',
			'index': 1,
			'newText': '; ',
			'outHTML': '<span class="comment">;; </span>'
		},
		{'inHTML': '<span class="number-literal">1</span><span class="binary-operator">+</span><span class="number-literal">4</span>',
			'index': 1,
			'newText': '2',
			'outHTML': '<span class="number-literal">12</span><span class="binary-operator">+</span><span class="number-literal">4</span>'
		},
		{'inHTML': '<span class="string-literal">\'\'</span>',
			'index': 1,
			'newText': '5',
			'outHTML': '<span class="string-literal">\'5\'</span>'
		},
		{'inHTML': '',
			'index': 0,
			'newText': '\n',
			'outHTML': '\n'
		},
		{'inHTML': '\n',
			'index': 0,
			'newText': '\n',
			'outHTML': '\n\n'
		},
		{'inHTML': '\n',
			'index': 1,
			'newText': '\n',
			'outHTML': '\n\n'
		},
		{'inHTML': '\n\n',
			'index': 1,
			'newText': '\n',
			'outHTML': '\n\n\n'
		},*/
	];
	const containerID = 'test-container';
	const fromLineNumber = 0;
	const procNameSet = new Set();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const lineGroup = document.createElement('span');
		lineGroup.id = Highlighter.formatLineGroupID(containerID, fromLineNumber);
		lineGroup.innerHTML = caseInfo.inHTML;
		insertText(lineGroup, caseInfo.index, caseInfo.newText, procNameSet);
		if (simplifyHTML(lineGroup.innerHTML) !== simplifyHTML(caseInfo.outHTML))
			plogger(`Expected "${escapeHTML(simplifyHTML(caseInfo.outHTML))}" but got "${escapeHTML(simplifyHTML(lineGroup.innerHTML))}"`);
	});
};