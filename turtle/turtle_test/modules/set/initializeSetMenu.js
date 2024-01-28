import { ColorMenuItem } from './ColorMenuItem.js';
import { GraphicsScreen } from '../components/GraphicsScreen.js';
import { PenSizeItem } from './PenSizeItem.js';
import { PenUpDownItem } from './PenUpDownItem.js';
import { ValueWrapper } from '../ValueWrapper.js';

import('./animationTimeItem.js');
import('./toggleTurtleVisibility.js');

const setMenuElement = document.getElementById('set-menu');

export function initializeSetMenu(settings) {
	const penColorItem = new ColorMenuItem('Pen Color', new ValueWrapper(function() {
		return settings.turtle.drawState.getPenColor();
	},
	function(newVal) {
		settings.turtle.drawState.setPenColor(newVal);
	}), 'set-pen-color', false);
	const screenColorItem = new ColorMenuItem('Screen Color', new ValueWrapper(function() {
		return settings.turtle.drawing.getScreenColor();
	}, function(newVal) {
		settings.turtle.drawing.setScreenColor(newVal);
		GraphicsScreen.redraw();
	}), 'set-screen-color', true);
	const fillColorItem = new ColorMenuItem('Fill Color', new ValueWrapper(function() {
		return settings.turtle.drawState.getFillColor();
	}, function(newVal) {
		settings.turtle.drawState.setFillColor(newVal);
	}), 'set-fill-color', true);
	const penSizeItem = PenSizeItem(settings);
	const eventListeners = [];
	function addListeners() {
		// No need to repeatedly add handlers.
		if (eventListeners.length !== 0)
			return;
		const drawStateChangeHandler = function() {
			penColorItem.refreshValue();
			fillColorItem.refreshValue();
			screenColorItem.refreshValue();
		};
		const turtleChangeHandler = function() {
			screenColorItem.refreshValue();
		};
		settings.turtle.drawState.addEventListener('change', drawStateChangeHandler);
		settings.turtle.addEventListener('setScreenColor', function() {
			screenColorItem.refreshValue();
		});
		settings.turtle.addEventListener('change', turtleChangeHandler);
		eventListeners.push(drawStateChangeHandler, turtleChangeHandler);
	}
	function removeListeners() {
		eventListeners.forEach(function(handler) {
			settings.turtle.removeEventListener(handler);
			settings.turtle.drawState.removeEventListener(handler);
		});
		eventListeners.length = 0;
	}
	PenUpDownItem(settings);
	setMenuElement.addEventListener('focus', addListeners);
	setMenuElement.addEventListener('mouseover', addListeners);
	setMenuElement.addEventListener('blur', removeListeners);
	setMenuElement.addEventListener('mouseout', removeListeners);
};