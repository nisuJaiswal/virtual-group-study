import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.awt.font.*;
public class Practical_15 extends JFrame implements ActionListener{
    Font myFont = new Font("Arial", Font.BOLD, 30);
	JLabel lblInput;
	JRadioButton rdo0;
	JRadioButton rdo1;
	JRadioButton rdo2;
	JButton btnSubmit;
	JTextField txtShow;
	ButtonGroup grp;
	Practical_15(){
		super("Practical 15");
		lblInput = new JLabel("How many vaccine doses you have taken?");
		rdo0 = new JRadioButton("0");
		rdo1 = new JRadioButton("1");
		rdo2 = new JRadioButton("2");
		grp = new ButtonGroup();
		grp.add(rdo0);
		grp.add(rdo1);
		grp.add(rdo2);
		btnSubmit = new JButton("CLICK HERE AFTER SELECTING DOSE NUMBER");
		txtShow = new JTextField();
		txtShow.setEditable(false);
		
		lblInput.setBounds(100,80,700,40);
		rdo0.setBounds(750,80,100,40);
		rdo1.setBounds(850,80,100,40);
		rdo2.setBounds(950,80,100,40);
		btnSubmit.setBounds(100,140,900,40);
		txtShow.setBounds(100,200,900,40);
				  
		
		add(lblInput);
		add(rdo0);
		add(rdo1);
		add(rdo2);
		add(btnSubmit);			  
		add(txtShow);			  
		setSize(1100,400);
		setLayout(null);
		setVisible(true);
		lblInput.setFont(myFont);
		rdo0.setFont(myFont);
		rdo1.setFont(myFont);
		rdo2.setFont(myFont);
		btnSubmit.setFont(myFont);
		txtShow.setFont(myFont);
		btnSubmit.addActionListener(this);
		addWindowListener(new WindowAdapter(){
            public void windowClosing(WindowEvent e){
                System.exit(0);
            }
        });
	}
	public void actionPerformed(ActionEvent e){
		if(e.getSource() == btnSubmit){
			String str = "You didn't select any choices...!";
			if(rdo0.isSelected())
				str = "You are not Vaccinated at all...";
			else if(rdo1.isSelected())
				str = "You are partially Vaccinated...";
			else if(rdo2.isSelected())
				str = "You are fully Vaccinated...";
			txtShow.setText(str);
		}
	}
	public static void main(String args[]){
		new Practical_15();
	}
}