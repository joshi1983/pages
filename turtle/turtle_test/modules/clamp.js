/*
clamp always returns a value between the specified minimum and maximum assuming min <= max.
If num is between min and max, num is returned.  Otherwise, the nearest limit is returned.
*/
export function clamp(num, min, max) {
	return Math.max(min, Math.min(max, num));
}