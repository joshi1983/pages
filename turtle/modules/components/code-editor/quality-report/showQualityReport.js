import { addParseTreeAnalysisMessages } from './addParseTreeAnalysisMessages.js';
import { Dialog } from
'../../Dialog.js';
import { fetchText } from
'../../../fetchText.js';
import { MessageCount } from
'./MessageCount.js';
//import { RandomExecutionTester } from './RandomExecutionTester.js';
const html = await fetchText('content/components/code-editor/quality-report.html');
const menuItem = document.getElementById('editor-testing-quality-report');

function showQualityReport() {
	let messageCount, randomExecutionTester;
	Dialog.show(html, 'Quality Report', 500, 300).then(function() {
		messageCount.dispose();
		if (randomExecutionTester !== undefined)
			randomExecutionTester.dispose();
	});
	const messageContainer = document.getElementById('quality-report-messages');
	//const statusDisplay = document.getElementById('quality-report-status');
	messageCount = new MessageCount();
	addParseTreeAnalysisMessages(messageContainer, messageCount);
	if (messageCount.count === 0) {
		/*
		const program = compile(code, , , , );
		randomExecutionTester = new RandomExecutionTester(program);
		randomExecutionTester.addEventListener('', 
		randomExecutionTester.addEventListener('complete', function() {
			statusDisplay.innerText = 'All tests passed.';
		});*/
	}
};

menuItem.addEventListener('click', showQualityReport);