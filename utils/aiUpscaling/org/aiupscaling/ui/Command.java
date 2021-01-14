package org.aiupscaling.ui;

import java.awt.event.*;
import javax.swing.JMenuItem;

public abstract class Command implements ActionListener {
	private String label;
	
	protected Command(String label) {
		this.label = label;
	}
	
	public JMenuItem createJMenuItem() {
		JMenuItem result = new JMenuItem(label);
		result.addActionListener(this);
		return result;
	}

	@Override
	public void actionPerformed(ActionEvent ae) {
		actionPerformed();
	}
	
	public abstract void actionPerformed();
}