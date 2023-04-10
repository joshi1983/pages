import { LogoDataInputStream } from '../../../../modules/command-groups/helpers/io/LogoDataInputStream.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function testMultipleLines(logger) {
	const stream = new LogoDataInputStream('tests/data/openread/multipleLines.txt');
	const expected = ['hello world', 'bye world', 'bye'];
	let processed = false;
	stream.bufferAll().then(function() {
		for (let i = 0; i < expected.length; i++) {
			const line = stream.readLine();
			const expectedLine = expected[i];
			if (line !== expectedLine)
				logger(`Expected ${expectedLine} but got ${line}`);
		}
		stream.dispose();
		processed = true;
	});
	const maxTimeout = 30000;
	setTimeout(function() {
		if (processed !== true) {
			logger(`Expected to process success before ${maxTimeout}ms but it is still not resolved`);
		}
	}, maxTimeout);
}

function testSingleLine(logger) {
	const stream = new LogoDataInputStream('tests/data/openread/singleLine.txt');
	let processed = false;
	stream.bufferAll().then(function() {
		const line = stream.readLine();
		const expected = 'hello world';
		if (line !== expected)
			logger(`Expected ${expected} but got ${line}`);
		stream.dispose();
		processed = true;
	});
	const maxTimeout = 30000;
	setTimeout(function() {
		if (processed !== true) {
			logger(`Expected to process success before ${maxTimeout}ms but it is still not resolved`);
		}
	}, maxTimeout);
}

export function testLogoDataInputStream(logger) {
	testMultipleLines(prefixWrapper('testMultipleLines', logger));
	testSingleLine(prefixWrapper('testSingleLine', logger));
};