/*
There are many dialogs and window-like elements in WebLogo which complicates efforts to lay out the space nicely for the user.
It is too complicated to manage strictly through CSS so this module is here to help define some of it through JavaScript.
*/
import { CodeEditor } from './CodeEditor.js';
import { CommandBoxResizer } from './CommandBoxResizer.js';
import { GraphicsScreen } from './GraphicsScreen.js';
const container = document.getElementById('container');
const mainMenuBar = document.getElementById('menu-bar');
const cursorStatus = document.getElementById('cursor-status');

function setContainerWidth(newContainerWidth) {
	if ((newContainerWidth === undefined) && (!container.style.width))
		return; // nothing to update
	if ((newContainerWidth + 'px' === container.style.width))
		return; // Nothing would change so just return.

	if (newContainerWidth === undefined)
		container.style.removeProperty('width');
	else
		container.style.width = newContainerWidth + 'px';
	GraphicsScreen.updateCanvasDimensions();
}

function adjustCodeEditorTextSize(isDebuggerAndStatusStacked) {
	if (!CodeEditor.isVisible)
		return; // nothing to do if we don't see it.
	const sideWidth = Math.max(Status.getWidth(), Debugger.getWidth());
	let windowWidth = window.innerWidth;
	let estimatedVisibleEditorWidth = windowWidth;
	if (!CodeEditor.isMaximized)
		estimatedVisibleEditorWidth *= 0.5;
	if (isDebuggerAndStatusStacked)
		estimatedVisibleEditorWidth -= sideWidth;

	if (estimatedVisibleEditorWidth < 400)
		CodeEditor.useSmallText();
	else
		CodeEditor.useNormalTextSize();
}

function refreshLayout() {
	const debugStatusStackWidthThreshold = 950;
	const viewportHeight = window.innerHeight;
	const viewportWidth = window.innerWidth;
	let usableTop = 0;
	// At very narrow width, the main menu bar needs vertical space for "Help" on the right side to show.
	if (viewportWidth < 700)
		usableTop = mainMenuBar.offsetHeight;

	let usableViewportHeight = viewportHeight - usableTop;
	let containerWidth = undefined;
	const commanderHeight = cursorStatus.offsetHeight + CommandBoxResizer.getHeight();
	setContainerWidth(containerWidth);
	adjustCodeEditorTextSize(false);
}

CodeEditor.addEventListener('layout', refreshLayout);
CommandBoxResizer.addEventListener('layout', refreshLayout);
window.addEventListener('resize', refreshLayout);
refreshLayout();
import('./commander-buttons/CommanderButtonsLayoutManager.js');