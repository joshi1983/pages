import { getFilenameFromPath } from '../../../modules/file/assets/getFilenameFromPath.js';

export function testGetFilenameFromPath(logger) {
	const cases = [
		{'in': 'hello.txt', 'out': 'hello.txt'},
		{'in': 'Hello.txt', 'out': 'Hello.txt'},
		{'in': 'fakepath/hello.txt', 'out': 'hello.txt'},
		{'in': 'fakepath\\hello.txt', 'out': 'hello.txt'},
		{'in': 'c://fakepath/hello.txt', 'out': 'hello.txt'},
		{'in': 'c:\\fakepath\\hello.txt', 'out': 'hello.txt'},
	];
	cases.forEach(function(caseInfo, index) {
		const result = getFilenameFromPath(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Case ${index}.  Expected result ${caseInfo.out} but got ${result}`);
	});
};