import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { scanInnerText } from '../../../../modules/components/syntax-highlighter/inner-text/scanInnerText.js';

export function testScanInnerTextManyCases(logger) {
	const cases = [
		{'innerText': '', 'resultUndefined': true},
		{'innerText': ' ', 'resultUndefined': true},
		{'innerText': 'to', 'resultUndefined': false,
			'classNames': ['keyword'],
			'resultHTML': '<span class="keyword">to</span>'
		},
		{'innerText': 'to p', 'resultUndefined': false,
			'classNames': ['keyword', 'procedure-name'],
			'resultHTML': '<span class="keyword">to</span> <span class="procedure-name">p</span>'
		},
		{'innerText': 'to p :x', 'resultUndefined': false,
			'classNames': ['keyword', 'procedure-name', 'procedure-parameter'],
			'resultHTML': '<span class="keyword">to</span> <span class="procedure-name">p</span> <span class="procedure-parameter">:x</span>'
		},
		{'innerText': 'penDown', 'resultUndefined': false, 
			'classNames': ['parameterized-group'],
			'resultHTML': '<span class="parameterized-group">penDown</span>'
		},
		{'innerText': 'penDown \t', 'resultUndefined': false, 
			'classNames': ['parameterized-group'],
			'resultHTML': '<span class="parameterized-group">penDown</span> \t'
		},
		{'innerText': ' penDown', 'resultUndefined': false, 
			'classNames': ['parameterized-group'],
			'resultHTML': ' <span class="parameterized-group">penDown</span>'
		},
		{'innerText': 'p+2', 'resultUndefined': false, 
			'classNames': ['', 'binary-operator', 'number-literal'],
			'resultHTML': 'p<span class="binary-operator">+</span><span class="number-literal">2</span>'
		},
		{'innerText': 'fd 100', 'resultUndefined': false, 
			'classNames': ['parameterized-group', 'number-literal'],
			'resultHTML': '<span class="parameterized-group">fd</span> <span class="number-literal">100</span>'
		},
		{'innerText': '"500 4', 'resultUndefined': false, 
			'classNames': ['string-literal', 'number-literal'],
			'resultHTML': '<span class="string-literal">"500</span> <span class="number-literal">4</span>'
		},
		{'innerText': '4+2', 'resultUndefined': false, 
			'classNames': ['number-literal', 'binary-operator', 'number-literal'],
			'resultHTML': '<span class="number-literal">4</span><span class="binary-operator">+</span><span class="number-literal">2</span>'
		},
		{'innerText': '4\n', 'resultUndefined': false, 
			'classNames': ['number-literal', ''],
			'resultHTML': '<span class="number-literal">4</span>\n'
		},
		{'innerText': '\n\n', 'resultUndefined': false, 
			'classNames': ['', ''],
			'resultHTML': '\n\n'
		},
		{'innerText': ';; ', 'resultUndefined': false, 
			'classNames': ['comment'],
			'resultHTML': '<span class="comment">;; </span>'
		},
		{'innerText': ';; 5\n', 'resultUndefined': false, 
			'classNames': ['comment', ''],
			'resultHTML': '<span class="comment">;; 5</span>\n'
		},
		{'innerText': '12+4', 'resultUndefined': false,
			'classNames': ['number-literal', 'binary-operator', 'number-literal'],
			'resultHTML': '<span class="number-literal">12</span><span class="binary-operator">+</span><span class="number-literal">4</span>'
		},
		{'innerText': '\'\'', 'resultUndefined': false,
			'classNames': ['string-literal'],
			'resultHTML': '<span class="string-literal">\'\'</span>'
		},
		{'innerText': ' \'\'', 'resultUndefined': false,
			'classNames': ['string-literal'],
			'resultHTML': ' <span class="string-literal">\'\'</span>'
		},
		{'innerText': ' \'5\'', 'resultUndefined': false,
			'classNames': ['string-literal'],
			'resultHTML': ' <span class="string-literal">\'5\'</span>'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, innerText: ${caseInfo.innerText}`, logger);
		const procNameSet = new Set();
		const container = document.createElement('pre');
		const lineGroup = document.createElement('span');
		container.appendChild(lineGroup);
		const node = document.createTextNode(caseInfo.innerText);
		lineGroup.appendChild(node);
		const nodes = scanInnerText(node, procNameSet);
		const actualInnerText = lineGroup.innerText;
		if (lineGroup.parentNode !== container)
			plogger(`Expected parentNode to continue being the original container but got ${lineGroup.parentNode}`);
		if (actualInnerText !== caseInfo.innerText)
			plogger(`Expected innerText to be "${caseInfo.innerText}" but got "${actualInnerText}"`);
		if (caseInfo.resultHTML !== undefined && caseInfo.resultHTML !== lineGroup.innerHTML)
			plogger(`Expected innerHTML to be "${escapeHTML(caseInfo.resultHTML)}" but got "${escapeHTML(lineGroup.innerHTML)}"`);
		if (caseInfo.resultUndefined !== (nodes === undefined))
			plogger(`Expected undefined of ${caseInfo.resultUndefined} but got ${nodes === undefined}.  result is ${nodes}`);
		else if (caseInfo.resultUndefined !== true) {
			if (!(nodes instanceof Array))
				plogger(`Expected result to be an Array but got ${nodes}`);
			else if (caseInfo.classNames !== undefined) {
				if (caseInfo.classNames.length !== nodes.length)
					plogger(`Expected to get ${caseInfo.classNames.length} nodes but got ${nodes.length}`);
				else {
					caseInfo.classNames.forEach(function(className, index) {
						const element = nodes[index];
						if (className !== '') {
							if (!(element instanceof Element))
								plogger(`Expected class of ${className} but got a non-Element node: ${element}`);
							else if (!element.classList.contains(className))
								plogger(`Node ${index} expected to have class name ${className} but the actual className="${element.className}"`);
						}
					});
				}
			}
		}
	});
};