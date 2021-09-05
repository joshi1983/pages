import { testHTMLSetter } from './testHTMLSetter.js';

export function runTests(Setters) {
	if (!(Setters instanceof Array))
		throw new Error(`Setters expected to be an Array but got ${Setters}`);
	const results = document.getElementById('correctness-test-results');
	let isFailed = false;
	Setters.forEach(function(Setter) {
		const prefix = Setter.name + ': ';

		function log(msg) {
			const e = document.createElement('div');
			e.innerText = prefix + msg;
			results.appendChild(e);
			isFailed = true;
		}
		testHTMLSetter(log, Setter);
	});
	let msg = 'Passed';
	if (isFailed)
		msg = 'Failed!';
	const msgElement = document.createElement('div');
	msgElement.innerText = msg;
	results.appendChild(msgElement);
};