import { CallStackItems } from './debugger/CallStackItems.js';
import { ElementUtils } from '../components/ElementUtils.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { fetchText } from '../fetchText.js';
import { IntermediateCodeExplorer } from './IntermediateCodeExplorer.js';
import { makeCollapsible } from './debugger/makeCollapsible.js';
import { ParseTreeExplorer } from './ParseTreeExplorer.js';
import { RefreshTimer } from './debugger/RefreshTimer.js';
import { RepcountStackItems } from './debugger/RepcountStackItems.js';
import { showGeneralHelpContent } from '../help/showGeneralHelpContent.js';
import { Settings } from '../Settings.js';
import { Variables } from './debugger/Variables.js';
const debuggerHTML = await fetchText('content/debugging/debugger.html');
const debuggerItem = document.getElementById('debugging-debugger');
let debuggerElement = document.createElement('div');
debuggerElement.innerHTML = debuggerHTML;
debuggerElement = debuggerElement.querySelector(':scope > div');
const callStackParent = debuggerElement.querySelector('#debugger-call-stack-parent');
const callStackContainer = debuggerElement.querySelector('#debugger-call-stack-container');
const callStackItems = new CallStackItems(Settings.executer);
const debuggerButton = document.getElementById('commander-debugger');
const debuggerCloseButton = debuggerElement.querySelector('#debugger-close');
const debuggerHelpButton = debuggerElement.querySelector('#debugger-help');
const globalVariablesParent = debuggerElement.querySelector('#debugger-global-variables-parent');
const globalVariablesContainer = debuggerElement.querySelector('#debugger-global-variables');
const globalVariables = new Variables(Settings.executer.executionContext.globalVariables);
const intermediateCodeExplorerButton = debuggerElement.querySelector('#debugger-show-intermediate-code-explorer');
const parseTreeExplorerButton = debuggerElement.querySelector('#debugger-show-parse-tree');
const repcountStackParent = debuggerElement.querySelector('#debugger-repcount-stack-parent');
const repcountStackContainer = debuggerElement.querySelector('#debugger-repcount-stack-container');
const repcountStackItems = new RepcountStackItems(Settings.executer.executionContext.repcountStack);
makeCollapsible(globalVariablesParent, refreshGlobalVariables);
makeCollapsible(callStackParent, refreshCallStack);
makeCollapsible(repcountStackParent, refreshRepcountStack);


function refreshCallStack(forceRefresh) {
	if (forceRefresh === true || !callStackParent.classList.contains("collapsed"))
		callStackItems.refreshContainer(callStackContainer);
}

function refreshRepcountStack(forceRefresh) {
	if (forceRefresh === true || !repcountStackParent.classList.contains("collapsed"))
		repcountStackItems.refreshContainer(repcountStackContainer);
}

function refreshGlobalVariables(forceRefresh) {
	if (forceRefresh === true || !globalVariablesParent.classList.contains("collapsed")) {
		const divs = globalVariables.getDivs();
		if (divs.length === 0)
			globalVariablesContainer.innerHTML = 'No global variables';
		else {
			globalVariablesContainer.innerHTML = '';
			divs.forEach(function(div) {
				globalVariablesContainer.appendChild(div);
			});
		}
	}
}

function refreshScope() {
	refreshGlobalVariables();
}

function refreshExecutionState(forceRefresh) {
	refreshCallStack(forceRefresh);
	refreshRepcountStack(forceRefresh);
	refreshScope(forceRefresh);
}

function showDebuggerHelp() {
	showGeneralHelpContent('debugger');
}

function showDebugger() {
	debuggerButton.setAttribute('disabled', '');
	debuggerButton.setAttribute('title', 'Debugger already showing');
	debuggerItem.checked = true;
	document.body.appendChild(debuggerElement);
	refreshExecutionState(true);
	Debugger._dispatchEvent('layout', {});
	if (Settings.executer.isRunning())
		refreshTimer.startContinuousRefresh();
}

function hideDebugger() {
	debuggerButton.removeAttribute('disabled');
	debuggerButton.setAttribute('title', 'Show debugger');
	debuggerElement.remove();
	debuggerItem.checked = false;
	Debugger._dispatchEvent('layout', {});
	refreshTimer.stopContinuousRefresh();
}

debuggerItem.addEventListener('change', function() {
	if (debuggerItem.checked)
		showDebugger();
	else
		hideDebugger();
});

function showIntermediateCodeExplorer() {
	IntermediateCodeExplorer.show();
}

function showParseTreeExplorer() {
	ParseTreeExplorer.show();
}

debuggerButton.addEventListener('click', showDebugger);
debuggerCloseButton.addEventListener('click', hideDebugger);
debuggerHelpButton.addEventListener('click', showDebuggerHelp);
intermediateCodeExplorerButton.addEventListener('click', showIntermediateCodeExplorer);
parseTreeExplorerButton.addEventListener('click', showParseTreeExplorer);
const refreshTimer = new RefreshTimer(refreshExecutionState);
Settings.executer.addEventListener('execution-stopped', function() {
	if (Debugger.isVisible())
		refreshExecutionState(true);
	refreshTimer.stopContinuousRefresh();
});
Settings.executer.addEventListener('execution-started', function() {
	refreshTimer.startContinuousRefresh();
});
Settings.executer.addEventListener('program-changed', function() {
	globalVariables.setMap(Settings.executer.executionContext.globalVariables);
	repcountStackItems.setStack(Settings.executer.executionContext.repcountStack);
});

class PrivateDebugger extends EventDispatcher {
	constructor() {
		super(['layout']);
	}

	getMaxHeight() {
		return 400;
	}

	getWidth() {
		return debuggerElement.offsetWidth;
	}

	isVisible() {
		return debuggerItem.checked;
	}

	setHeight(newHeight) {
		if (typeof newHeight !== 'number')
			throw new Error('newHeight must be a number');
		debuggerElement.style.height = (newHeight - ElementUtils.getVerticalPadding(debuggerElement)) + 'px';
	}

	setRight(newRight) {
		if (typeof newRight === 'number')
			newRight = newRight + 'px';
		debuggerElement.style.right = newRight;
	}

	setTop(newTop) {
		if (typeof newTop === 'number')
			newTop = newTop + 'px';
		debuggerElement.style.top = newTop;
	}
}

const Debugger = new PrivateDebugger();
hideDebugger();
export { Debugger };