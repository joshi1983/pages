import { Asset } from '../../modules/assets/Asset.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

function testGetShortFilename(logger) {
	const cases = [
		{'in': 'hello.txt', 'out': 'hello.txt'},
		{'in': 'bla/hello.txt', 'out': 'hello.txt'},
		{'in': 'bla\\hello.txt', 'out': 'hello.txt'},
		{'in': 'do/bla/hello.txt', 'out': 'hello.txt'},
		{'in': 'do\\bla\\hello.txt', 'out': 'hello.txt'},
	];
	cases.forEach(function(caseInfo, index) {
		const asset = new Asset(caseInfo.in, 'hello world');
		const result = asset.getShortFilename();
		if (result !== caseInfo.out)
			logger(`Case ${index} expected ${caseInfo.out} but got ${result}`);
	});
}

function testLoadAndSave(logger) {
	const asset = new Asset('tests_test_test.lgo', 'hello world');
	asset.saveToLocalStorage();
	asset.loadFromLocalStorage();
	asset.removeFromLocalStorage();
};

export function testAsset(logger) {
	testGetShortFilename(prefixWrapper('testGetShortFilename', logger));
	testLoadAndSave(prefixWrapper('testLoadAndSave', logger));
};