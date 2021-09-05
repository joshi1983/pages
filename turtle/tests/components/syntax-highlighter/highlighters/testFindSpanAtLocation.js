import { addLocationOffset, findSpanAtLocation, processText } from '../../../../modules/components/syntax-highlighter/highlighters/findSpanAtLocation.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testAddLocationOffset(logger) {
	const cases = [
	{'inArgs': [{'colIndex': 0, 'lineIndex': 0}, {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 0}},
	{'inArgs': [{'colIndex': 1, 'lineIndex': 0}, {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 1, 'lineIndex': 0}},
	{'inArgs': [{'colIndex': 2, 'lineIndex': 0}, {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 2, 'lineIndex': 0}},
	{'inArgs': [{'colIndex': 0, 'lineIndex': 1}, {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 1}},
	{'inArgs': [{'colIndex': 0, 'lineIndex': 2}, {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 2}},
	{'inArgs': [{'colIndex': 0, 'lineIndex': 6}, {'colIndex': 0, 'lineIndex': 5}], 'out': {'colIndex': 0, 'lineIndex': 1}},
	{'inArgs': [{'colIndex': 0, 'lineIndex': 12}, {'colIndex': 10, 'lineIndex': 5}], 'out': {'colIndex': 0, 'lineIndex': 7}},
	];
	testInOutPairs(cases, addLocationOffset, logger, {'jsonStringifyAll': true});
}

function testProcessText(logger) {
	const cases = [
	{'inArgs': ['', {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 0}},
	{'inArgs': ['h', {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 1, 'lineIndex': 0}},
	{'inArgs': ['he', {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 2, 'lineIndex': 0}},
	{'inArgs': ['\n', {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 1}},
	{'inArgs': ['\n\n', {'colIndex': 0, 'lineIndex': 0}], 'out': {'colIndex': 0, 'lineIndex': 2}},
	{'inArgs': ['\n', {'colIndex': 0, 'lineIndex': 5}], 'out': {'colIndex': 0, 'lineIndex': 6}},
	{'inArgs': ['\n', {'colIndex': 10, 'lineIndex': 5}], 'out': {'colIndex': 0, 'lineIndex': 6}},
	];
	testInOutPairs(cases, processText, logger);
}

function testFindSpanAtLocationIntegrated(logger) {
	const cases = [
	{'html': '<span>repeat</span> <span>4</span> <span>[</span>\n<span>]</span>',
		'token': {'lineIndex': 1, 'colIndex': 0},
		'resultInnerText': ']'
	},
	{'html': '<span>repeat</span> <span>4</span> <span>[</span>\n<span>]</span>',
		'token': {'lineIndex': 0, 'colIndex': 9},
		'resultInnerText': '['
	},
	{'html': '<span>hello world</span>', 'token': {'lineIndex': 0, 'colIndex': 1}, 'resultInnerText': 'hello world'},
	{'html': '<span>hello</span><span>world</span>', 'token': {'lineIndex': 0, 'colIndex': 1}, 'resultInnerText': 'hello'},
	{'html': '<span>hello</span>\n<span>world</span>', 'token': {'lineIndex': 1, 'colIndex': 3}, 'resultInnerText': 'world'},
	{'html': '<span>hello</span>\n<span>world</span><span>yo</span>', 'token': {'lineIndex': 1, 'colIndex': 4}, 'resultInnerText': 'world'},
	{'html': '<span>hello</span>\n<span>world</span><span>yo</span>', 'token': {'lineIndex': 1, 'colIndex': 5}, 'resultInnerText': 'yo'},
	{'html': '<span>hello</span>\n<span>world</span><span>yo</span>', 'token': {'lineIndex': 1, 'colIndex': 6}, 'resultInnerText': 'yo'},
	{'html': '<span id="textarea-syntax-highlighter-1-highlighter-lines-from-10" class="">	<span class="square-bracket">]</span></span>', 'token': {
		'lineIndex': 0,
		'colIndex': 1
	}, 'resultInnerText': ']'},
	{'html': '<span><span></span> <span></span>\n</span>\n<span>	<span class="square-bracket">]</span></span>', 'token': {
		'lineIndex': 2,
		'colIndex': 1
	}, 'resultInnerText': ']'},
	{'html': `<span id="textarea-syntax-highlighter-1-highlighter-lines-from-0">
<span class="parameterized-group">make</span> <span class="string-literal">"lightColor1</span> <span class="string-literal color-literal" style="background-image: linear-gradient(#FFFFFF,#FFFFFF, white)">"white</span>
<span class="parameterized-group">make</span> <span class="string-literal">"lightColor2</span> <span class="string-literal color-literal" style="background-image: linear-gradient(#BAE6EB,#BAE6EB, white)">"#bae6eb</span>
<span class="parameterized-group">make</span> <span class="string-literal">"darkColor1</span> <span class="string-literal color-literal dark" style="background-image: linear-gradient(#000000,#000000, black)">"black</span>
<span class="parameterized-group">make</span> <span class="string-literal">"darkColor2</span> <span class="string-literal color-literal dark" style="background-image: linear-gradient(#0C2F6D,#0C2F6D, black)">"#0c2f6d</span>
<span class="parameterized-group">make</span> <span class="string-literal">"greenColor1</span> <span class="string-literal color-literal dark" style="background-image: linear-gradient(#115522,#115522, black)">"#152</span>
<span class="keyword">to</span> <span class="procedure-name">circleOfCircles</span> <span class="procedure-parameter">:size</span>
	<span class="parameterized-group">localmake</span> <span class="string-literal">"oldPos</span> <span class="parameterized-group">pos</span>
	<span class="parameterized-group">repeat</span> <span class="number-literal">32</span> <span class="square-bracket">[</span>
		<span class="parameterized-group">jumpForward</span> <span class="variable-read">:size</span></span>
<span id="textarea-syntax-highlighter-1-highlighter-lines-from-10" class="">	<span class="square-bracket">]</span>
<span class="keyword">end</span></span>`, 'token': {
	'lineIndex': 10,
	'colIndex': 1
}, 'resultInnerText': ']'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('div');
		container.innerHTML = caseInfo.html;
		const result = findSpanAtLocation(container, caseInfo.token);
		if (result !== undefined) {
			const innerText = result.innerText;
			if (innerText !== caseInfo.resultInnerText) {
				plogger(`Expected ${caseInfo.resultInnerText} but got ${innerText}`);
			}
		}
		else if (caseInfo.resultInnerText !== undefined)
			plogger(`Expected to find span with innerText ${caseInfo.resultInnerText} but did not find a span at all`);
	});
}

export function testFindSpanAtLocation(logger) {
	wrapAndCall([
		testAddLocationOffset,
		testFindSpanAtLocationIntegrated,
		testProcessText
	], logger);
};