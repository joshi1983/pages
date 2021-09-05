import { Code } from './Code.js';
import { EventQueue } from '../EventQueue.js';
import { mightExecuteDifferently } from './mightExecuteDifferently.js';
import { isUsingMaximumSpeed, switchToMaximumSpeed } from '../../debugging/executionSpeedMenuItem.js';
import { resetAndTest } from './resetAndTest.js';
import { ToastMessages } from '../ToastMessages.js';

const autoRunItem = document.getElementById('editor-autorun');
let isOn = false;
let latestRunParseTree;
const isOnClassName = 'autorun-on';

function disableAutorunInternal() {
	isOn = false;
	autoRunItem.classList.remove(isOnClassName);
}

function autoRunItemClicked() {
	isOn = !isOn;
	if (isOn) {
		if (!isUsingMaximumSpeed()) {
			switchToMaximumSpeed('. Rerunning automatically at any slower speed will not show the results fast enough.');
		}
		autoRunItem.classList.add(isOnClassName);
	}
	else
		disableAutorunInternal();
}

function handleEventQueueEvent(e) {
	if (isOn) {
		const events = EventQueue.getEvents();
		if (events.length > 0) {
			const lastEvent = events[events.length - 1];
			if (lastEvent.info.type === 'no-parse-errors') {
				const currentParseTree = lastEvent.info.tree;
				// Avoid unneeded runs because the flickering can be
				// mildly annoying for the end user.
				// Unneeded executions can also make other features 
				// slightly less responsive without much benefit.
				if (latestRunParseTree !== undefined &&
				!mightExecuteDifferently(latestRunParseTree, currentParseTree))
					return;
				resetAndTest();
			}
		}
	}
}

function handleRunStarted() {
	latestRunParseTree = Code.executer.executionContext.logoProgram.parseTree;
}

export function disableAutorun(msg) {
	if (isOn) {
		disableAutorunInternal();
		ToastMessages.success(msg, false);
	}
}

autoRunItem.addEventListener('click', autoRunItemClicked);
EventQueue.addEventListener('change', handleEventQueueEvent);
Code.addEventListener('run-started', handleRunStarted);