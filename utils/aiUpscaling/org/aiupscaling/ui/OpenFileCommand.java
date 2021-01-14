package org.aiupscaling.ui;

import javax.swing.JFileChooser;
import java.io.File;
import javax.swing.filechooser.FileFilter;

public class OpenFileCommand extends Command {
	private ImagePanels viewer;

	public OpenFileCommand(ImagePanels viewer) {
		super("Open");
		this.viewer = viewer;
	}

	private class ImageFileFilter extends FileFilter {
		public String getDescription() {
			return "Images (*.png;*.bmp;*.gif;*.jpg)";
		}

		public boolean accept(File f) {
			if (f.isDirectory()) {
				return true; // show directories even though we don't want anyone selecting one.
			} else {
				String []extensions = new String[] {".png", ".jpg", ".gif", ".bmp"};
				String name = f.getName().toLowerCase();
				for (String extension: extensions) {
					if (name.endsWith(extension)) {
						return true;
					}
				}
				return false;
			}
		}
	}

	@Override
	public void actionPerformed() {
		// open JFileChooser.
		JFileChooser fc = new JFileChooser();
		fc.setFileFilter(new ImageFileFilter());
		int result = fc.showOpenDialog(null);
		if (result == JFileChooser.APPROVE_OPTION) {
            File file = fc.getSelectedFile();
			viewer.loadImage(file);
        }
	}
}