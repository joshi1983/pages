/*
Clamps an angle in radians between 0 and 2 pi.
If out of range, the angle returned will overlap.
*/
const twoPi = Math.PI * 2;

export function clampRadianAngle(a) {
	if (a < 0)
		return a + Math.ceil(Math.abs(a) / twoPi) * twoPi;
	else if (a >= twoPi)
		return a - Math.floor(a / twoPi) * twoPi;
	else
		return a;
}