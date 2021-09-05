import { isTooLargeException } from '../../../modules/file/assets/isTooLargeException.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testIsTooLargeException(logger) {
	const mock = new DOMException(`'Storage' Setting the value of 'assets-scream3.jpg' exceeded the quota.
    at Asset.saveToLocalStorage`);
	const cases = [
	{'in': new Error('hi'), 'out': false},
	{'in': mock, 'out': true}
	];
	testInOutPairs(cases, isTooLargeException, logger);
};