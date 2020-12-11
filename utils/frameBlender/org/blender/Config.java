package org.blender;

public class Config {
	private static final String [] recognizedKeys = new String[] {
		"dir", "max", "min"
	};
	private static final int DIR_KEY = 0;
	private static final int MAX_KEY = 1;
	private static final int MIN_KEY = 2;
	public int minFrameIndex;
	public int maxFrameIndex;
	public String directory;

	public Config(String a[]) {
		// defaults
		minFrameIndex = 0;
		maxFrameIndex = Integer.MAX_VALUE;
		directory = "D:/uhdcircles/volumetric_frames";

		if (get(DIR_KEY, a) != null)
			directory = get(DIR_KEY, a);
		if (get(MAX_KEY, a) != null)
			maxFrameIndex = Integer.parseInt(get(MAX_KEY, a));
		if (get(MIN_KEY, a) != null)
			minFrameIndex = Integer.parseInt(get(MIN_KEY, a));

		get(DIR_KEY, a, true);
	}

	private static String get(int key, String a[]) {
		return get(key, a, false);
	}

	private static boolean isRecognized(String key) {
		for (String recognizedKey: recognizedKeys) {
			if (recognizedKey.equals(key))
				return true;
		}
		return false;
	}

	private static String get(int key, String a[], boolean printWarnings) {
		String keyString = "-" + recognizedKeys[key];
		for (int i = 0; i < a.length; i+=2) {
			if (a[i].equals(keyString)) {
				return a[i + 1];
			}
			else if (printWarnings && a[i].indexOf("-") != 0) {
				System.err.println("Unrecognizable argument key(" + a[i] + ").  Must start with a hyphen(-).");
			}
			else if (printWarnings) {
				String keyS = a[i].substring(1); // remove the -.
				if (!isRecognized(keyS)) {
					System.err.println("Unrecognizable argument key(" + a[i] + ").");
					System.err.println("The supported keys are:");
					for (String key1: recognizedKeys) {
						System.err.println(key1);
					}
				}
			}
		}
		return null;
	}
}