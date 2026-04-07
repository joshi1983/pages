import { exceptionToString } from
'../modules/exceptionToString.js';
import { fetchText } from
'../modules/fetchText.js';
import { prefixWrapper } from
'./helpers/prefixWrapper.js';
import { ProgressIndicator } from
'./helpers/ProgressIndicator.js';
import { ready } from
'../modules/ready.js';
import { StringUtils } from
'../modules/StringUtils.js';

let testModuleUrls = [
	/*'./bindDocumentFocusTests.js',
	'./testAlphaColour.js',
	'./testArrayUtils.js',
	'./assets/testAssets.js',
	'./testBinarySearch.js',
	'./testBlobToBase64.js',
	'./testClamp.js',
	'./testClampRadianAngle.js',
	'./testColour.js',
	'./colour/testColourDirectory.js',
	'./command-groups/testCommandGroups.js',
	'./testCommands.js',
	'./commands-json/testCommandsJSON.js',
	'./components/testComponents.js',
	'./debugging/testDebugging.js',
	'./testDeepEquality.js',
	'./testDelay.js',
	'./drawing/testDrawing.js',
	'./drawing-menu/testDrawingMenu.js',
	'./testEqualWithinThreshold.js',
	'./testExceptionToString.js',
	'./testFetchBlob.js',
	'./file/testFile.js',
	'./testFormatNumber.js',
	'./help/testHelp.js',
	'./testIsCloseEnough.js',
	'./testIsDigit.js',
	'./testJavaScriptJSON.js',
	'./testLogoCodeMigrationsJSON.js',
	'./testLongestCommonSubsequence.js',
	'./testMapUtils.js',
	'./testMaybeDecided.js',
	'./testOperatorsJSON.js',
	*/'./parsing/testParsing.js',/*
	'./testPopulateTemplateUsingObject.js',
	'./testRateLimiter.js',
	'./set/testSet.js',
	'./testSetUtils.js',
	'./testStringBuffer.js',
	'./testStringUtils.js',
	'./testTransparent.js',
	'./testUnsupportedCommandsJSON.js',
	'./testValueToLiteralCode.js',
	'./testValueToString.js',
	'./testValueWrapper.js',
	'./testWindowsCommandsJSON.js'*/
];

function processSearch() {
	let s = window.location.search;
	let index = s.indexOf('test=');
	if (index !== -1) {
		s = s.substring(index + 'test='.length);
		index = s.indexOf('&');
		if (index !== -1)
			s = s.substring(0, index);

		if (s !== '') {
			// a little sanitization
			if (!s.startsWith('./'))
				s = './' + s;
			if (!s.endsWith('.js'))
				s = s + '.js';
			s = StringUtils.replacePairs(s, [['\\', '/']]);
			testModuleUrls = [s];
			const h1 = document.createElement('h1');
			h1.innerText = `Test narrowed to ${s}`;
			document.body.insertBefore(h1, document.body.firstChild);
		}
	}
}

function replaceSpecialChars(msg) {
	msg = msg.replace(/ /g, '&nbsp;');
	msg = msg.replace(/\t/g, 'TAB');
	msg = msg.replace(/\n/g, 'NEW_LINE\n');
	return msg;
}

function isPossibleTestModule(s) {
	if (!s.startsWith('tests/') ||
	!s.endsWith('.js'))
		return false;

	const index = s.lastIndexOf('/');
	const filename = s.substring(index + 1);
	if (!filename.startsWith('test'))
		return false;

	return true;
}

function populateDatalist() {
	fetchText('tests/data/js-filenames.txt').then(function(text) {
		const lines = StringUtils.sanitizeLineBreaks(text).split('\n');
		if (lines.length > 2) {
			const datalist = document.getElementById('test-modules');
			const selectedModuleInput = document.getElementById('selected-test-module');
			const runButton = document.getElementById('run-test');
			if (testModuleUrls.length === 1)
				selectedModuleInput.value = testModuleUrls[0];

			function isRunnable() {
				if (selectedModuleInput.value === '')
					return true;
				return isPossibleTestModule('tests/' + selectedModuleInput.value);
			}
			function removeWarning() {
				selectedModuleInput.classList.remove('warning');
			}

			function refreshButtonClickable() {
				removeWarning();
				runButton.classList.toggle('clickable', isRunnable());
			}
			for (const line of lines) {
				if (!isPossibleTestModule(line))
					continue;

				const option = document.createElement('option');
				option.value = line.substring('tests/'.length);
				datalist.appendChild(option);
			}
			refreshButtonClickable();
			selectedModuleInput.addEventListener('change', refreshButtonClickable);
			selectedModuleInput.addEventListener('keyup', refreshButtonClickable);
			runButton.addEventListener('click', function() {
				if (isRunnable()) {
					const selectedModule = selectedModuleInput.value;
					if (selectedModule === '')
						window.location.search = '';
					else
						window.location.search = '?test=' + selectedModule;
				}
				else {
					selectedModuleInput.classList.add('warning');
					setTimeout(removeWarning, 2000);
				}
			});
		}
	});
}

async function runTests() {
	populateDatalist();
	const results = document.getElementById('test-results');
	const progressIndicators = document.getElementById('progress-indicators');
	function log(msg) {
		var li = document.createElement('li');
		if (typeof msg === 'string') {
			msg = replaceSpecialChars(msg);
			for (let i = 1; i < arguments.length; i++) {
				msg += '<br>' + replaceSpecialChars(arguments[i]);
			}
			li.innerHTML = msg;
		}
		else {
			li.appendChild(msg);
		}
		results.appendChild(li);
	}
	processSearch();
	log.indicators = {
		'push': function(indicator) {
			indicator.show(progressIndicators);
		}
	};
	const progressIndicator = new ProgressIndicator('Overall Tests');
	log.indicators.push(progressIndicator);
	let i = 0;
	for (const url of testModuleUrls) {
		progressIndicator.setMessage(`Importing from ${url}`);
		try {
			const module = await import(url);
			const index = url.lastIndexOf('/');
			let key = index === -i ? url : url.substring(index + 1);
			if (key.endsWith('.js'))
				key = key.substring(0, key.length - 3);
			const testFunc = module[key];
			progressIndicator.setMessage(`Running ${key}`);
			const result = testFunc(prefixWrapper(url, log));
			if (result instanceof Promise)
				await result;
		} catch (e) {
			console.error(e);
			log(`${url}, An exception/error happened.  e=${exceptionToString(e)}`);
		}
		progressIndicator.setProgressRatio(i / testModuleUrls.length);
		i++;
	}
	progressIndicator.completed();
	log('All synchronous tests are complete.');
}

ready(runTests);