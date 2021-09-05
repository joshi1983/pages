export function flipAngles(data) {
	return data.map(function(pair) {
		if (pair.length < 2)
			return pair;
		else
			return [-pair[0], ...pair.slice(1)];
	});
};