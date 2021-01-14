package org.aiupscaling;

public class BlueGetter implements ValueGetter {
	public int get(byte[] pixelBytes, int width, int x, int y) {
		return Byte.toUnsignedInt(pixelBytes[(x + y * width) * 3 + 2]);
	}
}
