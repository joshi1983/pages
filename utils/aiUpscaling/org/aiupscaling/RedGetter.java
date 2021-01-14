package org.aiupscaling;

public class RedGetter implements ValueGetter {
	public int get(byte[] pixelBytes, int width, int x, int y) {
		return Byte.toUnsignedInt(pixelBytes[(x + y * width) * 3]);
	}
}
