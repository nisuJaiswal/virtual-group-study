package miniproject;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.sql.*;

class CodingCamp implements ActionListener{
	
	// DECLARATIONS
	JFrame frm; //Main Frame

	// LABELS
	JLabel heading,anotherHeading, bg,lblFirstName,lblMiddleName,lblLastName,lblEmailId,lblPhone,lblAddress,lblGender,lblKnownLang,lblSem;

	// TEXTFIELDS
	JTextField txtFirstName,txtMiddleName,txtLastName,txtEmailId,txtPhone;
	
	// TEXT AREAS
	JTextArea txaAddress;
	JTextArea txaComments,displayDetails;
	
	// RADIO BUTTONS
	JRadioButton male,female;

	// GROUP OF BUTTON
	ButtonGroup radioGroup;
	
	// CHECKBOX
	JCheckBox chkC, chkCpp, chkJava, chkPython, chkCsharp;
	
	// COMBOBOX
	JComboBox cmbSem;
	
	// BUTTONS
	JButton btnSubmit, btnExit;
	
	
	CodingCamp(){
		
//		SETTING BACKGROUND IMAGE
		ImageIcon img=new ImageIcon("C:/Users/Jarvis/Desktop/background.jpg");
		bg = new JLabel("",img,JLabel.CENTER);
		bg.setBounds(0,0,4000,1000);
		
		
		// INITIALIZE AND SET THE VALUES
		
		//labels
		lblFirstName = new JLabel("First Name: ");
		lblMiddleName = new JLabel("Middle Name: ");
		lblLastName = new JLabel("Last Name: ");
		lblEmailId = new JLabel("Email Id: ");
		lblPhone = new JLabel("Phone No: ");
		lblAddress = new JLabel("Address: ");
		lblGender = new JLabel("Gender: ");
		lblKnownLang = new JLabel("Known Languages: ");
		lblSem = new JLabel("Semester: ");
		displayDetails = new JTextArea("",2,100);
		displayDetails.setEditable(false);
		heading = new JLabel("Coding Camp Registration");
		heading.setFont(new Font("Arial", Font.BOLD , 20));
		anotherHeading = new JLabel("User Details");
		anotherHeading.setFont(new Font("Arial", Font.BOLD , 20));

		// textbox
		txtFirstName = new JTextField(20);
		txtMiddleName = new JTextField(20);
		txtLastName = new JTextField(20);
		txtEmailId = new JTextField(20);
		txtPhone = new JTextField(20);
		
		// textArea
		txaAddress = new JTextArea(3,30);
		
		// checkbox
		chkC = new JCheckBox("C");
		chkCpp = new JCheckBox("C++");
		chkCsharp = new JCheckBox("C#");
		chkJava = new JCheckBox("Java");
		chkPython = new JCheckBox("Python");
		
		// radiobutton
		male = new JRadioButton("Male");
		female = new JRadioButton("Female");
		
		// radioGroup
		radioGroup = new ButtonGroup();
		radioGroup.add(male);
		radioGroup.add(female);
		
		// comboBox
		String cmbValues[] = {"1st","2nd","3rd","4th","5th","6th"};
		cmbSem = new JComboBox(cmbValues);
		
		// button
		btnSubmit = new JButton("Submit");
		btnExit = new JButton("Reset");
		
		// frame
		frm = new JFrame("Coding Camp Registration Form");
		frm.setSize(500,600);
		frm.setLayout(null);
		frm.setVisible(true);
		
//		MAKING COMPONENTS TRANSPARENT
		
		male.setOpaque(false);
		female.setOpaque(false);
		chkC.setOpaque(false);
		chkCsharp.setOpaque(false);
		chkCpp.setOpaque(false);
		chkJava.setOpaque(false);
		chkPython.setOpaque(false);
		
		
		// BOUND SET
		heading.setBounds(100, 10, 280, 30);
		
		anotherHeading.setBounds(550, 20, 280, 30);
		lblFirstName.setBounds(20,50,100,20);
		lblMiddleName.setBounds(20,80,100,20);
		lblLastName.setBounds(20,110,100,20);
		lblEmailId.setBounds(20,140,100,20);
		lblPhone.setBounds(20,170,100,20);
		lblGender.setBounds(20,200,100,20);
		lblKnownLang.setBounds(20,230,140,20);
		lblSem.setBounds(20,260,100,20);
		lblAddress.setBounds(20,290,100,20);
		
		txtFirstName.setBounds(140,50,260,20);
		txtMiddleName.setBounds(140,80,260,20);
		txtLastName.setBounds(140,110,260,20);
		txtEmailId.setBounds(140,140,260,20);
		txtPhone.setBounds(140,170,260,20);
		male.setBounds(140,200,100,20);
		female.setBounds(250,200,100,20);
		chkC.setBounds(140,230,50,20);
		chkCpp.setBounds(200,230,50,20);
		chkCsharp.setBounds(260,230,50,20);
		chkJava.setBounds(320,230,70,20);
		chkPython.setBounds(400,230,90,20);
		cmbSem.setBounds(140,263,150,20);
		txaAddress.setBounds(140,293,260,180);
		btnExit.setBounds(20,500,100,30);
		btnSubmit.setBounds(150,500,100,30);
		displayDetails.setBounds(550,70,300,400);
		btnSubmit.addActionListener(this);
		btnExit.addActionListener(this);
		
		// ADD COMPONENTS
		frm.add(lblFirstName);
		frm.add(anotherHeading);
		frm.add(lblMiddleName);
		frm.add(lblEmailId);
		frm.add(lblPhone);
		frm.add(lblGender);
		frm.add(lblAddress);
		frm.add(lblKnownLang);
		frm.add(lblSem);
		frm.add(lblLastName);
		frm.add(heading);
		frm.add(txtFirstName);
		frm.add(txtMiddleName);
		frm.add(txtLastName);
		frm.add(txtEmailId);
		frm.add(txtPhone);
		frm.add(male);
		frm.add(female);
		frm.add(chkC);
		frm.add(chkCpp);
		frm.add(chkCsharp);
		frm.add(chkJava);
		frm.add(chkPython);
		frm.add(cmbSem);
		frm.add(txaAddress);
		frm.add(btnExit);
		frm.add(btnSubmit);
		frm.add(displayDetails);
		frm.add(bg);
		
	}
	
	public void clear() {
		txtFirstName.setText("");	
		txtMiddleName.setText("");
		txtLastName.setText("");
		txtEmailId.setText("");
		txtPhone.setText("");
		txaAddress.setText("");
		male.setSelected(false);
		female.setSelected(false);
		chkPython.setSelected(false);
		chkCpp.setSelected(false);
		chkC.setSelected(false);
		chkJava.setSelected(false);
		chkCsharp.setSelected(false);	
	}
	
	// ACTION LISTENERS
	public void actionPerformed(ActionEvent e){
		if(e.getActionCommand().equals("Reset"))
		{
			clear();
		}
		if(e.getActionCommand().equals("Submit"))
		{
			
//			VALIDATIONS
			
			if(txtFirstName.getText().equals("") || txtMiddleName.getText().equals("") ||
			 txtLastName.getText().equals("") || txtEmailId.getText().equals("")
			 || txtPhone.getText().equals("") || txaAddress.getText().equals("")) {
				
				JOptionPane.showMessageDialog(frm,"Fill all the Fields");
			}
			else if(!male.isSelected() && !female.isSelected()) {
				JOptionPane.showMessageDialog(frm,"Select the Gender");
			}
			else if(!chkC.isSelected() && !chkCpp.isSelected() && !chkCsharp.isSelected() && 
					!chkJava.isSelected() && !chkPython.isSelected()) {
				JOptionPane.showMessageDialog(frm,"Select atleast one language");
			}
			
			else {
				
			String gender="";
			String lang="";
			if(male.isSelected())
			{
				gender="Male";
			}
			else if(female.isSelected())
			{
				gender="Female";
			}
			if(chkC.isSelected())
			{
				lang+=" C ";
			}
			if(chkCpp.isSelected())
			{
				lang+=" C++ ";
			}
			if(chkCsharp.isSelected())
			{
				lang+=" C# ";
			}
			if(chkJava.isSelected())
			{
				lang+=" Java ";
			}
			if(chkPython.isSelected())
			{
				lang+=" Python";
			}
			frm.setSize(900,620);
			
			try {
				Connection cn;
				PreparedStatement pstm;
				
				Class.forName("com.mysql.cj.jdbc.Driver");
				
				cn = DriverManager.getConnection("jdbc:mysql://localhost/ajavadb","root","nisu123");
				
				String Query = "insert into miniproject values (?,?,?,?,?,?,?,?,?);";
				pstm = cn.prepareStatement(Query);
				
				
				String fname = txtFirstName.getText();
				String mname = txtMiddleName.getText();
				String lname = txtLastName.getText();
				String email = txtEmailId.getText();
				String phone = txtPhone.getText();
				String sem = (String) cmbSem.getSelectedItem();
				String address = txaAddress.getText();
				
				
				System.out.println("Connected");
				pstm.setString(1, fname);
				pstm.setString(2, mname);
				pstm.setString(3, lname);
				pstm.setString(4, email);
				pstm.setString(5, phone);
				pstm.setString(6, gender);
				pstm.setString(7, lang);
				pstm.setString(8, sem);
				pstm.setString(9, address);
				
				pstm.execute();
				JOptionPane.showMessageDialog(frm,"Data inserted Successfully");
				
			} catch (Exception e2) {
				// TODO: handle exception
				System.out.println(e2);
			}
			String data = "Student Details:"+"\n\n"+
						"First Name: " + txtFirstName.getText()+"\n\n"+
						"Middle Name: " + txtMiddleName.getText() + "\n\n"+
						"Last Name: " + txtLastName.getText()+"\n\n"+
						"Email: " + txtEmailId.getText()+"\n\n"+
						"Phone: " + txtPhone.getText()+"\n\n"+
						"Gender: " + gender + "\n\n"+
						"Known Language: "+lang+"\n\n"+
						"Sem: " + cmbSem.getSelectedItem()+"\n\n"+
						"Address: " + txaAddress.getText()+"\n";
			displayDetails.setText(data);
			clear();
		}
		}
	}
}
public class MicroProject {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		new CodingCamp();

	}

}