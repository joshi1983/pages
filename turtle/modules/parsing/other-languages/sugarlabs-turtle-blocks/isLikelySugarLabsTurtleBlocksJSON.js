function isPossibleSecondElement(e) {
	if (typeof e !== 'string' &&
	!(e instanceof Array))
		return false;
	if (e instanceof Array) {
		if (e.length < 2)
			return false;
		const first = e[0];
		if (typeof first !== 'string')
			return false;
	}
	return true;
}

export function isLikelySugarLabsTurtleBlocksJSON(code) {
	let data;
	try {
		data = JSON.parse(code);
	}
	catch (e) {
		// invalid JSON
		return false;
	}
	if (!(data instanceof Array)) {
		return false;
	}
	if (data.length === 0)
		return false; // too little data.  
		// [] could easily enough be WebLogo code.

	for (const block of data) {
		if (!(block instanceof Array) || block.length < 5)
			return false;
		const first = block[0];
		if (!Number.isInteger(first) || first < -1)
			return false;
		const second = block[1];
		if (!isPossibleSecondElement(second))
			return false;
		const linkIndexes = block[4];
		if (!(linkIndexes instanceof Array) && block[0] !== -1)
			return false;
	}
	return true;
};