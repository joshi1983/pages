function getExtraSearchKeywords(example) {
	const result = [];
	let f = example.filename;
	while (true) {
		const index1 = f.indexOf('/');
		const s = f.substring(0, index1);
		let index = s.indexOf('_');
		if (index === -1) {
			result.push(s);
		}
		if (index1 !== -1) {
			f = f.substring(index1 + 1);
		}
		else
			break;
	}
	return result;
}

function compareLowerCase(s1, s2) {
	return s1.toLowerCase().localeCompare(s2.toLowerCase());
}

function addSearchKeywords(example) {
	const extraSearchKeywords = getExtraSearchKeywords(example);
	extraSearchKeywords.forEach(function(s) {
		s = s.trim();
		if (example.searchKeywords.indexOf(s) === -1 && s !== '')
			example.searchKeywords.push(s);
	});
	example.searchKeywords.sort(compareLowerCase);
}

export function sanitizeExamples(examples) {
	examples.forEach(addSearchKeywords);
};