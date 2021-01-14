package org.aiupscaling;

public interface ValueGetter {
	public int get(byte[] pixelBytes, int width, int x, int y);
}