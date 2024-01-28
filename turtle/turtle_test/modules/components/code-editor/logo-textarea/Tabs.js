class PrivateTabs {
	insertTabs(selectedString) {
		if (selectedString === '')
			return '\t';
		const lines = selectedString.split('\n');
		return lines.map(l => l === '' ? '' : '\t' + l).join('\n');
	}

	/*
	Removes the equivalent of 1 tab from the start of string s, 
	if there are enough whitespaces at the beginning to do so.
	*/
	leftTrimTab(s) {
		let i;
		for (i = 0; i < s.length; i++) {
			const ch = s.charAt(i);
			if (ch === '\t')
				return s.substring(0, i) + s.substring(i + 1);
			else if (!(/\s/g.test(ch)))
				break;
		}
		if (i === 0)
			return s;
		else if (i <= 4)
			return s.trimStart();
		else
			return s.substring(4);
	}

	removeTabs(s) {
		const lines = s.split('\n');
		return lines.map(l => this.leftTrimTab(l)).join('\n');
	}
};
const Tabs = new PrivateTabs();
export { Tabs };