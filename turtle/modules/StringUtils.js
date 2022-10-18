export class StringUtils {
	static capitalizeFirstLetter(s) {
		if (s.length === 0)
			return s;
		else
			return s.charAt(0).toUpperCase() + s.substring(1);
	}

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

	static forceFileExtension(filename, newExtension) {
		if (newExtension.startsWith('.'))
			newExtension = newExtension.substring(1);
		if (newExtension.indexOf('.') !== -1)
			throw new Error(`. should not be in newExtension but got ${newExtension}`);

		const index = filename.lastIndexOf('.');
		if (index === -1)
			return `${filename}.${newExtension}`;
		else
			return filename.substring(0, index) + '.' + newExtension;
	}

	static getLengthOfEqualEnding(s1, s2, minIndex1) {
		if (minIndex1 === undefined)
			minIndex1 = 0;
		const len = Math.min(s1.length, s2.length, s1.length - minIndex1, s2.length - minIndex1);
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