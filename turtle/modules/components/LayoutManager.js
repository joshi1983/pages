/*
There are many dialogs and window-like elements in WebLogo which complicates efforts to lay out the space nicely for the user.
It is too complicated to manage strictly through CSS so this module is here to help define some of it through JavaScript.
*/
import { CodeEditor } from './CodeEditor.js';
import { CommandBoxResizer } from './CommandBoxResizer.js';
import { Debugger } from '../debugging/Debugger.js';
import { GraphicsScreen } from './GraphicsScreen.js';
import { Status } from '../debugging/Status.js';
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
	else if (Status.isVisible() || Debugger.isVisible())
		estimatedVisibleEditorWidth -= sideWidth * 0.5;

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
	let newStatusTop = usableTop;
	let newStatusHeight = Math.min(usableViewportHeight, Status.getIdealHeight());
	let newDebuggerHeight = Math.min(usableViewportHeight, Debugger.getMaxHeight());
	let newDebuggerTop = usableTop;
	let newDebuggerRight = 0;
	let containerWidth = undefined;
	let isDebuggerAndStatusStacked = false;
	const commanderHeight = cursorStatus.offsetHeight + CommandBoxResizer.getHeight();

	if (Debugger.isVisible() && CodeEditor.isVisible)
		newDebuggerTop = CodeEditor.getWindowStateHeight();
	if (Status.isVisible()) {
		// if CodeEditor is also visible, push the top of the status down just enough to show the CodeEditor's window-state buttons.
		if (CodeEditor.isVisible)
			newStatusTop = CodeEditor.getWindowStateHeight();
		if (Debugger.isVisible()) {
			if (Debugger.getMaxHeight() + Status.getIdealHeight() < usableViewportHeight || viewportWidth < debugStatusStackWidthThreshold) {
				if (viewportWidth < debugStatusStackWidthThreshold) {
					newStatusHeight = Math.min(newStatusHeight, usableViewportHeight / 2);
				}
				// Status on top of Debugger.
				newDebuggerTop = newStatusHeight + newStatusTop;
				newDebuggerHeight = viewportHeight - newDebuggerTop;
				isDebuggerAndStatusStacked = true;
				if (!CodeEditor.isVisible)
					containerWidth = viewportWidth - Status.getWidth();
			}
			else {
				// Debugger to the left of Status
				newDebuggerTop = newStatusTop;
				newDebuggerRight = Status.getWidth();
				newDebuggerHeight = newStatusHeight;
			}
		}
	}
	if (!CodeEditor.isVisible && !isDebuggerAndStatusStacked && 
	(Debugger.isVisible() || Status.isVisible()) &&
	newDebuggerHeight > usableViewportHeight - commanderHeight) {
		// Shrink the container so the debug and/or status windows can use the full height of the viewport.
		if (Debugger.isVisible()) {
			containerWidth = viewportWidth - Debugger.getWidth();
			newDebuggerHeight = usableViewportHeight;
		}
		else
			containerWidth = viewportWidth;
		if (Status.isVisible()) {
			containerWidth -= Status.getWidth();
			newStatusHeight = usableViewportHeight;
		}
	}
	Status.setTop(newStatusTop);
	Status.setHeight(newStatusHeight);
	if (!Debugger.isMaximized()) {
		Debugger.setTop(newDebuggerTop);
		Debugger.setHeight(newDebuggerHeight);
		Debugger.setRight(newDebuggerRight);
	}
	setContainerWidth(containerWidth);
	adjustCodeEditorTextSize(isDebuggerAndStatusStacked);
	if (isDebuggerAndStatusStacked)
		document.body.classList.add('debug-status-stacked');
	else
		document.body.classList.remove('debug-status-stacked');
}

Debugger.addEventListener('layout', refreshLayout);
Status.addEventListener('layout', refreshLayout);
CodeEditor.addEventListener('layout', refreshLayout);
CommandBoxResizer.addEventListener('layout', refreshLayout);
window.addEventListener('resize', refreshLayout);
refreshLayout();
import('./commander-buttons/CommanderButtonsLayoutManager.js');