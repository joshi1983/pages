import { addMessage } from './addMessage.js';
import { addParseTreeAnalysisMessages } from './addParseTreeAnalysisMessages.js';
import { AnimationSetupTest } from './AnimationSetupTest.js';
import { Code } from '../Code.js';
import { CommandBoxMessages } from
'../../CommandBoxMessages.js';
import { compile } from
'../../../parsing/compile.js';
import { Dialog } from
'../../Dialog.js';
import { fetchText } from
'../../../fetchText.js';
import { getProceduresMap } from
'../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { MessageCount } from
'./MessageCount.js';
import { MessageTypes } from '../../MessageTypes.js';
import { messageToDiv } from
'../../messageToDiv.js';
import { QualityReportParseLogger } from './QualityReportParseLogger.js';
import { RandomExecutionTester } from './RandomExecutionTester.js';
import { RateLimiter } from
'../../../RateLimiter.js';
import { resetAndTest } from
'../resetAndTest.js';
import { Settings } from '../../../Settings.js';
import { ToastMessages } from '../../ToastMessages.js';

const html = await fetchText('content/components/code-editor/quality-report.html');
const menuItem = document.getElementById('editor-testing-quality-report');

function showQualityReport() {
	let messageCount, animationSetupTester, randomExecutionTester;
	Dialog.show(html, 'Quality Report', 500, 300, {
		'helpID': 'quality-report'
	}).then(function() {
		messageCount.dispose();
		if (animationSetupTester !== undefined)
			animationSetupTester.dispose();
		if (randomExecutionTester !== undefined)
			randomExecutionTester.dispose();
	});
	const messageContainer = document.getElementById('quality-report-messages');
	const statusDisplay = document.getElementById('quality-report-status');
	function statusLimited(msg) {
		RateLimiter.run('quality-report-status', function() {
			statusDisplay.innerText = msg;
		}, 100, true);
	}
	messageCount = new MessageCount(document.getElementById('quality-report-message-count'));
	const addMessageFunc = addMessage(messageContainer, messageCount, messageToDiv);
	const tree = addParseTreeAnalysisMessages(messageContainer, messageCount);
	if (messageCount.count === 0) {
		const proceduresMap = getProceduresMap(tree);
		const compileOptions = {
			'forProduction': false,
			// forProduction: false is for extra range, data type checks.
			'mergeJavaScriptInstructions': true,
			'parsedOptimize': true,
			'translateToJavaScript': true
		};
		const initialVariables = new Map();
		const code = Code.getSourceCode();
		const parseLogger = new QualityReportParseLogger(addMessageFunc);
		const program = compile(code, tree, parseLogger, proceduresMap, compileOptions, initialVariables);
		let animationSetupResult;

		function startRandomExecutionTests() {
			randomExecutionTester = new RandomExecutionTester(program, animationSetupResult.duration);
			randomExecutionTester.addEventListener('failure', function(msg) {
				addMessageFunc(msg, MessageTypes.TypeError, false, {
					'name': 'Reproduce',
					'onclick': function() {
						// FIXME: check what is applicable.
						// Don't set animation time or seedNumber unless they
						// may affect the program.
						const settings = randomExecutionTester.previousSettings;
						Settings.animationTime = settings.animationTime;
						Settings.seedNumber = settings.seedNumber;
						const msg = 'A couple settings were updated to reproduce a runtime failure. ' +
								`Animation time set to ${Settings.animationTime}.  `+
								`Pseudorandomization seed was set to ${Settings.seedNumber}.`;
						ToastMessages.success(msg, false);
						CommandBoxMessages.print(msg);
						Dialog.hide();
						resetAndTest();
					}
				});
			});
			randomExecutionTester.addEventListener('complete', function() {
				statusLimited('All tests passed.');
			});
			randomExecutionTester.addEventListener('runCountChanged', function(event) {
				statusLimited(`Ran ${event.details.count} times`);
			});
			randomExecutionTester.start();
		}
		animationSetupTester = new AnimationSetupTest(program);
		animationSetupTester.addEventListener('animation-setup-result', function(setupResultEvent) {
			animationSetupResult = setupResultEvent.details;
			statusLimited('Starting general execution tests');
			startRandomExecutionTests();
		});
		animationSetupTester.addEventListener('error', addMessageFunc);
		animationSetupTester.addEventListener('warning', addMessageFunc);
		animationSetupTester.start();
	}
};

menuItem.addEventListener('click', showQualityReport);