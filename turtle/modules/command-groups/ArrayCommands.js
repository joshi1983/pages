export class ArrayCommands {
	setItem(index, array, value) {
		if (index > array.length) {
			// Avoid leaving undefined or empty elements in the Array.
			for (let i = array.length; i < index; i++) {
				array[i] = 0;
			}
		}
		array[index - 1] = value;
	}
};