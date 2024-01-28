/*
Shows a tip every time the page loads, if one is appropriate based on what is in local storage.
*/
import { clamp } from '../clamp.js';
import { Code } from '../components/code-editor/Code.js';
import { Dialog } from '../components/Dialog.js';
import { EditorLocalStorage } from '../components/code-editor/EditorLocalStorage.js';
import { fetchText } from '../fetchText.js';
import { TimeLocalStorage } from '../set/animation-time/TimeLocalStorage.js';
import { wasScriptExampleUsed } from '../file/file-load-example/ScriptExampleLocalStorage.js';
import { wasTutorialUsed } from './tutorialLocalStorage.js';
const wrapperHTML = await fetchText('content/help/tips/tip-wrapper.html');

function showTip(id) {
	const filename = `content/help/tips/${id}.html`;
	const width = clamp(window.innerWidth, 200, 400);
	fetchText(filename).then(function(html) {
		Dialog.show(wrapperHTML, "Tip", width, 220, {
			'disableResize': true,
			'iconClass': 'fa fa-info-circle dialog-icon'
		});
		const container = document.getElementById('tip-content');
		container.innerHTML = html;
	});
}

function isSetTimeTipAppropriate() {
	if (TimeLocalStorage.isUsed())
		return false;
	const code = Code.getSourceCode().toLowerCase();
	return code.indexOf('animation.setup') !== -1;
}

function initialTip() {
	if (!wasTutorialUsed())
		showTip("tutorial");
	else if (!wasScriptExampleUsed())
		showTip('examples');
	else if (!EditorLocalStorage.wasEditorOpened())
		showTip('code-editor');
	else if (!EditorLocalStorage.wereBreakpointsUsed())
		showTip('breakpoints');
	else if (isSetTimeTipAppropriate())
		showTip('set-time');
}

initialTip();