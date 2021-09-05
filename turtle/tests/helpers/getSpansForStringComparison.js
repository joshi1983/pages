export function getSpansForStringComparison(s1, s2) {
	if (typeof s1 !== 'string')
		throw new Error(`s1 must be a string but got ${s1}`);
	if (typeof s2 !== 'string')
		throw new Error(`s2 must be a string but got ${s2}`);
	const fromS = document.createElement('span');
	let i;
	for (i = 0; i < s1.length; i++) {
		if (s1[i] !== s2[i]) 
			break;
	}
	fromS.innerText = s1.substring(0, i);
	const toS = document.createElement('span');
	toS.classList.add('unequal-string');
	toS.innerText = s1.substring(i);
	return [fromS, toS];
};