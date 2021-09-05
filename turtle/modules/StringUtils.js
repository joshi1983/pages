export class StringUtils {
	static countChar(s, ch, fromIndex, toIndex) {
		if (fromIndex === undefined)
			fromIndex = 0;
		if (toIndex === undefined)
			toIndex = s.length;
		let result = 0;
		for (let i = fromIndex; i < toIndex; i++) {
			if (s[i] === ch)
				result++;
		}
		return result;
	}

	static firstCharLower(s) {
		return s.charAt(0).toLowerCase() + s.substring(1);
	}

	static getLengthOfEqualEnding(s1, s2, minIndex1) {
		if (minIndex1 === undefined)
			minIndex1 = 0;
		const len = Math.min(s1.length, s2.length, s1.length - minIndex1);
		for (let i = 1; i <= len; i++) {
			if (s1[s1.length - i] !== s2[s2.length - i])
				return i - 1;
		}
		return len;
	}

	static indexOfNthOccurrance(hey, fromIndex, needle, n) {
		for (fromIndex = hey.indexOf(needle, fromIndex);
		fromIndex !== -1;) {
			if (n === 0)
				return fromIndex;
			n--;
			fromIndex = hey.indexOf(needle, fromIndex + 1);
		}
		return -1;
	}
};