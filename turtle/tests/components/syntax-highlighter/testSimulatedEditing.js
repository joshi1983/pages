import { delay } from '../../../modules/delay.js';
import { preHTMLSetterMap, highlightLogoSyntaxInTextarea } from '../../../modules/components/syntax-highlighter/highlightLogoSyntaxInTextarea.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { validateSelectiveHTMLSetter } from './validateSelectiveHTMLSetter.js';

const mockToastMessages = {
	'success': function() {}
};

const mockConvertToAsset = async function() {
	
};

function tail(s, len) {
	if (s.length >= len)
		return s.substring(s.length - len);
	else
		return s;
}

function countLinesInString(s) {
	return s.split('\n').length;
}

function countLines(visualizationContainer) {
	return Array.from(visualizationContainer.querySelectorAll('div')).length;
}

function validateAllSetters(logger) {
	for (const setter of preHTMLSetterMap.values()) {
		validateSelectiveHTMLSetter(setter, logger);
	}
}

export async function testSimulatedEditing(logger) {
	const code1 = `; Inspired by logo for
; https://twitter.com/
to twitterLogo :height
	localmake "oldState turtleState
	jumpForward :height * 0.11723
	jumpLeft :height * 0.61719
	right 123
	setFillColor "#1D9BF4
	setPenSize 0
	polyStart
	arcLeft 50 :height * 0.703
	arcLeft 40 :height * 0.72
	arcLeft 36.2 :height * 0.695
	right 57
	arcLeft 19.8 :height * 0.52
	left 148
	arcRight 17.1 :height * 0.5
	right 155
	arcLeft 39 :height * 0.265
	left 139.5
	arcRight 19.6 :height * 0.5
	right 56.5
	arcLeft 148 :height * 0.251
	right 104.5
	arcRight 49.5 :height * 0.69
	left 112
	arcLeft 86 :height * 0.251
	right 145
	arcRight 33 :height * 0.21
	left 121
	arcLeft 79.8 :height * 0.25
	right 153.5
	arcRight 26.5 :height * 0.25
	left 118.9
	arcLeft 71.2 :height * 0.25
	right 141
	arcRight 45 :height * 0.502
	polyEnd
	setTurtleState :oldState
end

twitterLogo 100`;
	// code2 is code1 with several lines removed.
	const code2 = code1.split('\n').filter(function(line, index) {
		return index < 4 || index > 25;
	}).join('\n');
	const expected = 'twitterLogo 100';
	const div = document.createElement('div');
	div.classList.add('syntax-highlighter');
	const textarea = document.createElement('textarea');
	const context = {
		'convertToAsset': mockConvertToAsset,
		'ToastMessages': mockToastMessages
	};
	div.appendChild(textarea);
	highlightLogoSyntaxInTextarea(textarea, context);
	await delay(200);
	const container = div.querySelector('.visualization-container');
	if (container === null)
		logger(`Expected to find visualization-container but did not`);
	validateAllSetters(logger);

	// Simulate loading a bunch of code from an example.
	textarea.value = code1;
	await delay(100);
	textarea.dispatchEvent(new Event('keyup'));
	await delay(200);
	if (countLines(container) !== countLinesInString(code1))
		logger(`After setting to code1, expected number of lines to be ${countLinesInString(code1)} but got ${countLines(container)}`);
	validateAllSetters(logger);

	// Simulate removing a several lines of code from the middle of the script.
	textarea.value = code2;
	await delay(100);
	textarea.dispatchEvent(new Event('keyup'));
	await delay(200);
	if (div.innerText.indexOf(expected) === -1)
		logger(`Expected to find ${expected} but did not in ${tail(div.innerText, 50)}`);
	if (countLines(container) !== countLinesInString(code2))
		logger(`After setting to code2, expected number of lines to be ${countLinesInString(code2)} but got ${countLines(container)}`);
	validateAllSetters(prefixWrapper('after setting to code2', logger));

	// Simulate inserting several lines back into the middle of the script.
	textarea.value = code1;
	await delay(100);
	textarea.dispatchEvent(new Event('keyup'));
	await delay(200);
	if (div.innerText.indexOf(expected) === -1)
		logger(`Expected to find ${expected} but did not in ${tail(div.innerText, 50)}`);
	if (countLines(container) !== countLinesInString(code1))
		logger(`After setting back to code1, expected number of lines to be ${countLinesInString(code1)} but got ${countLines(container)}`);
	validateAllSetters(prefixWrapper('after setting back to code1', logger));
};