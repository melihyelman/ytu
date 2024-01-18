package proje;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.ButtonGroup;
import javax.swing.JTextField;
import javax.swing.JLabel;
import javax.swing.JOptionPane;

import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JTextArea;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.awt.event.ActionEvent;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.swing.JScrollPane;
import javax.swing.GroupLayout;
import javax.swing.GroupLayout.Alignment;
import java.awt.CardLayout;
import javax.swing.SwingConstants;
import javax.swing.LayoutStyle.ComponentPlacement;
import javax.swing.JRadioButton;
import java.awt.Color;
import javax.swing.JTextPane;
import java.awt.Font;
import javax.swing.border.BevelBorder;

public class Gui extends JFrame {

	private static final long serialVersionUID = 1L;
	private JPanel contentPane;
	private Distributor distributor;
	private JTextField journalName;
	private JTextField journalIssn;
	private JTextField journalFrequency;
	private JTextField journalIssuePrice;
	private JTextField subscriberName;
	private JTextField subscriberAddress;
	private JTextField searchJournalIssn;
	private JTextField searchSubscriberName;
	private JTextField subscriptionJournalIssn;
	private JTextField subscriptionSubscriberName;
	private JTextField subscriptionCopies;
	private JTextField sendingMonth;
	private JTextField sendingYear;
	private JTextField searchSubscriptionWithName;
	private JTextField searchSubscriptionWithIssn;
	private JTextField paymentJournalIssn;
	private JTextField paymentSubscriberName;
	private JTextField paymentDiscountRatio;
	private JTextField paymentAmount;
	private JTextField sendingIssn;
	private JTextField subscriptionMonth;
	private JTextField subscriptionYear;
	private JTextField fileName;

	
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Gui frame = new Gui();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	public Gui() {
		distributor = new Distributor();

		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 1164, 823);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));

		setContentPane(contentPane);
		contentPane.setLayout(new GridLayout(1, 0, 0, 0));

		JPanel panel = new JPanel();
		contentPane.add(panel);

		JPanel panel_1 = new JPanel();
		panel_1.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));

		JPanel panel_2 = new JPanel();
		panel_2.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));

		JPanel panel_3 = new JPanel();
		panel_3.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));

		JPanel panel_4 = new JPanel();
		panel_4.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));

		JPanel panel_3_1 = new JPanel();
		panel_3_1.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));
		panel_3_1.setLayout(null);

		JLabel lblNewLabel_4_3 = new JLabel("Journal Issn:");
		lblNewLabel_4_3.setBounds(6, 57, 130, 16);
		panel_3_1.add(lblNewLabel_4_3);

		searchSubscriptionWithName = new JTextField();
		searchSubscriptionWithName.setColumns(10);
		searchSubscriptionWithName.setBounds(6, 148, 176, 26);
		panel_3_1.add(searchSubscriptionWithName);

		JTextPane searchSubscriptionInfo = new JTextPane();
		searchSubscriptionInfo.setBounds(286, 34, 557, 205);
		panel_3_1.add(searchSubscriptionInfo);
		JScrollPane scrollPane = new JScrollPane(searchSubscriptionInfo);
		scrollPane.setSize(557, 205);
		scrollPane.setLocation(286, 34);

		panel_3_1.add(scrollPane);

		searchSubscriptionWithIssn = new JTextField();
		searchSubscriptionWithIssn.setColumns(10);
		searchSubscriptionWithIssn.setBounds(6, 75, 176, 26);
		panel_3_1.add(searchSubscriptionWithIssn);

		JLabel lblNewLabel_10 = new JLabel("Search Subscription");
		lblNewLabel_10.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_10.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_10.setBounds(6, 6, 837, 16);
		panel_3_1.add(lblNewLabel_10);

		JLabel lblNewLabel_4_1_2 = new JLabel("Subscriber Name:");
		lblNewLabel_4_1_2.setBounds(6, 131, 117, 16);
		panel_3_1.add(lblNewLabel_4_1_2);

		JButton searchSubscriptionWithNameBtn = new JButton("Search");
		searchSubscriptionWithNameBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (searchSubscriptionWithName.getText().length() != 0) {
					ArrayList<Subscription> subscriptions = distributor
							.listSubscriptions(searchSubscriptionWithName.getText());
					if (subscriptions == null) {
						searchSubscriptionInfo.setText("There is no subscriber with this name!");
					} else {
						String str = "";
						for (Subscription subscription : subscriptions) {
							str += subscription.toString() + "\n\n";
						}
						searchSubscriptionInfo.setText(str);
					}
				}
			}
		});
		searchSubscriptionWithNameBtn.setBounds(183, 148, 91, 29);
		panel_3_1.add(searchSubscriptionWithNameBtn);

		JButton searchSubscriptionWithIssnBtn = new JButton("Search");
		searchSubscriptionWithIssnBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (searchSubscriptionWithIssn.getText().length() != 0) {
					ArrayList<Subscription> subscriptions = distributor
							.listSubscriptionsWithIssn(searchSubscriptionWithIssn.getText());
					if (subscriptions == null) {
						searchSubscriptionInfo.setText("There is no journal with this issn!");
					} else {
						String str = "";
						for (Subscription subscription : subscriptions) {
							str += subscription.toString() + "\n\n";
						}
						searchSubscriptionInfo.setText(str);
					}
				}
			}
		});
		searchSubscriptionWithIssnBtn.setBounds(183, 75, 91, 29);
		panel_3_1.add(searchSubscriptionWithIssnBtn);

		JPanel panel_5 = new JPanel();
		panel_5.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));

		JPanel panel_3_1_1 = new JPanel();
		panel_3_1_1.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));
		panel_3_1_1.setLayout(null);

		JLabel lblNewLabel_4_3_1 = new JLabel("Journal Issn:");
		lblNewLabel_4_3_1.setBounds(6, 64, 130, 16);
		panel_3_1_1.add(lblNewLabel_4_3_1);

		sendingIssn = new JTextField();
		sendingIssn.setColumns(10);
		sendingIssn.setBounds(98, 59, 176, 26);
		panel_3_1_1.add(sendingIssn);

		JLabel lblNewLabel_10_1 = new JLabel("List Orders and Incomplete Payments");
		lblNewLabel_10_1.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_10_1.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_10_1.setBounds(6, 6, 656, 16);
		panel_3_1_1.add(lblNewLabel_10_1);

		JLabel lblNewLabel_4_1_2_1 = new JLabel("If you don't write issn, all of them will be displayed.");
		lblNewLabel_4_1_2_1.setFont(new Font("Lucida Grande", Font.PLAIN, 11));
		lblNewLabel_4_1_2_1.setBounds(6, 27, 274, 34);
		panel_3_1_1.add(lblNewLabel_4_1_2_1);

		JPanel panel_6 = new JPanel();
		panel_6.setBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));
		GroupLayout gl_panel = new GroupLayout(panel);
		gl_panel.setHorizontalGroup(gl_panel.createParallelGroup(Alignment.LEADING)
				.addGroup(gl_panel.createSequentialGroup().addContainerGap()
						.addGroup(gl_panel
								.createParallelGroup(
										Alignment.LEADING)
								.addGroup(
										gl_panel.createSequentialGroup()
												.addComponent(panel_1, GroupLayout.PREFERRED_SIZE, 251,
														GroupLayout.PREFERRED_SIZE)
												.addPreferredGap(ComponentPlacement.UNRELATED)
												.addComponent(panel_2, GroupLayout.PREFERRED_SIZE, 356,
														GroupLayout.PREFERRED_SIZE)
												.addPreferredGap(ComponentPlacement.RELATED).addComponent(panel_3,
														GroupLayout.PREFERRED_SIZE, 522, GroupLayout.PREFERRED_SIZE)
												.addContainerGap())
								.addGroup(gl_panel.createSequentialGroup()
										.addGroup(gl_panel.createParallelGroup(Alignment.TRAILING, false)
												.addComponent(panel_5, Alignment.LEADING, GroupLayout.DEFAULT_SIZE,
														GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
												.addComponent(panel_4, Alignment.LEADING, GroupLayout.DEFAULT_SIZE, 286,
														Short.MAX_VALUE))
										.addPreferredGap(ComponentPlacement.UNRELATED)
										.addGroup(gl_panel.createParallelGroup(Alignment.LEADING)
												.addGroup(gl_panel.createSequentialGroup()
														.addComponent(panel_3_1, GroupLayout.DEFAULT_SIZE, 854,
																Short.MAX_VALUE)
														.addGap(1))
												.addGroup(gl_panel.createSequentialGroup()
														.addComponent(panel_3_1_1, GroupLayout.PREFERRED_SIZE, 664,
																GroupLayout.PREFERRED_SIZE)
														.addPreferredGap(ComponentPlacement.RELATED)
														.addComponent(panel_6, GroupLayout.PREFERRED_SIZE, 172,
																GroupLayout.PREFERRED_SIZE)
														.addGap(13)))))));
		gl_panel.setVerticalGroup(gl_panel.createParallelGroup(Alignment.LEADING).addGroup(gl_panel
				.createSequentialGroup()
				.addGroup(gl_panel.createParallelGroup(Alignment.LEADING, false)
						.addGroup(gl_panel.createSequentialGroup().addContainerGap().addComponent(panel_3,
								GroupLayout.PREFERRED_SIZE, 283, GroupLayout.PREFERRED_SIZE))
						.addComponent(panel_2, GroupLayout.DEFAULT_SIZE, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
						.addComponent(panel_1, GroupLayout.DEFAULT_SIZE, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
				.addGap(18)
				.addGroup(gl_panel.createParallelGroup(Alignment.LEADING)
						.addComponent(panel_3_1, GroupLayout.DEFAULT_SIZE, 238, Short.MAX_VALUE)
						.addComponent(panel_4, GroupLayout.PREFERRED_SIZE, 238, GroupLayout.PREFERRED_SIZE))
				.addPreferredGap(ComponentPlacement.RELATED)
				.addGroup(gl_panel.createParallelGroup(Alignment.LEADING)
						.addComponent(panel_5, GroupLayout.PREFERRED_SIZE, 228, GroupLayout.PREFERRED_SIZE)
						.addComponent(panel_3_1_1, GroupLayout.PREFERRED_SIZE, 238, GroupLayout.PREFERRED_SIZE)
						.addComponent(panel_6, GroupLayout.PREFERRED_SIZE, 231, GroupLayout.PREFERRED_SIZE))
				.addContainerGap()));
		panel_6.setLayout(null);

		JLabel lblNewLabel_12 = new JLabel("Save, Load and Report");
		lblNewLabel_12.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_12.setBounds(6, 6, 160, 16);
		panel_6.add(lblNewLabel_12);

		JLabel info = new JLabel("");
		info.setFont(new Font("Lucida Grande", Font.PLAIN, 11));
		info.setHorizontalAlignment(SwingConstants.LEFT);
		info.setBounds(6, 156, 160, 43);
		panel_6.add(info);

		JLabel lblNewLabel_13 = new JLabel("File Name");
		lblNewLabel_13.setBounds(6, 34, 85, 16);
		panel_6.add(lblNewLabel_13);

		fileName = new JTextField();
		fileName.setBounds(6, 53, 160, 26);
		panel_6.add(fileName);
		fileName.setColumns(10);

		JButton btnNewButton_1 = new JButton("Save");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (fileName.getText().length() != 0) {
					if (distributor.saveState(fileName.getText())) {
						info.setText("State saved successfully");
					} else {
						info.setText("Something went wrong!");
					}
				} else {
					info.setText("You have to write a file name!");
				}
			}
		});
		btnNewButton_1.setBounds(6, 84, 160, 29);
		panel_6.add(btnNewButton_1);

		JButton btnNewButton_1_1 = new JButton("Load");
		btnNewButton_1_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (fileName.getText().length() != 0) {
					if (distributor.loadState(fileName.getText())) {
						info.setText("States loaded successfully");
					} else {
						info.setText("Something went wrong!");
					}
				} else {
					info.setText("You have to write a file name!");
				}
			}
		});
		btnNewButton_1_1.setBounds(6, 125, 160, 29);
		panel_6.add(btnNewButton_1_1);

		JButton reportBtn = new JButton("Report");
		reportBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				JPanel panel = new JPanel(new GridLayout(5, 2));

				JLabel monthLabel = new JLabel("Month:");
				JLabel yearLabel = new JLabel("Year");

				JLabel firstYearLabel = new JLabel("Start Year:");
				JLabel secondYearLabel = new JLabel("End Year:");

				panel.add(monthLabel);
				JTextField monthField = new JTextField(2);
				panel.add(monthField);

				panel.add(yearLabel);
				JTextField yearField = new JTextField(4);
				panel.add(yearField);

				panel.add(firstYearLabel);
				JTextField firstYearField = new JTextField(4);
				panel.add(firstYearField);

				panel.add(secondYearLabel);
				JTextField secondYearField = new JTextField(4);
				panel.add(secondYearField);

				int result = JOptionPane.showConfirmDialog(null, panel, "Report",
						JOptionPane.OK_CANCEL_OPTION);

				if (result == JOptionPane.OK_OPTION) {

					try {
						int month = Integer.parseInt(monthField.getText());
						int year = Integer.parseInt(yearField.getText());
						int startYear = Integer.parseInt(firstYearField.getText());
						int endYear = Integer.parseInt(secondYearField.getText());
						if (isValidDate(month, 1, year) && isValidDate(1, 1, startYear) && isValidDate(1, 1, endYear)) {
							if(distributor.report(month,year,startYear,endYear)) {
								info.setText("<html>Report created successfully!<br>Check the report.html file</html>");
							}
						} else {
							info.setText("Date format wrong!");
						}
					} catch (NumberFormatException err) {
						info.setText("You have to write a number!");
					}
				}
			}
		});
		reportBtn.setBounds(6, 196, 160, 29);
		panel_6.add(reportBtn);

		JLabel lblNewLabel_9 = new JLabel("Month");
		lblNewLabel_9.setBounds(6, 94, 85, 16);
		panel_3_1_1.add(lblNewLabel_9);

		sendingMonth = new JTextField();
		sendingMonth.setBounds(98, 89, 176, 26);
		panel_3_1_1.add(sendingMonth);
		sendingMonth.setColumns(10);

		sendingYear = new JTextField();
		sendingYear.setBounds(98, 122, 176, 26);
		panel_3_1_1.add(sendingYear);
		sendingYear.setColumns(10);

		JLabel lblNewLabel_9_1 = new JLabel("Year");
		lblNewLabel_9_1.setBounds(6, 127, 85, 16);
		panel_3_1_1.add(lblNewLabel_9_1);

		JTextArea listInfo = new JTextArea();
		listInfo.setBounds(281, 34, 377, 198);
		panel_3_1_1.add(listInfo);
		panel_5.setLayout(null);

		JButton listSendingOrders = new JButton("List Sending Orders");
		listSendingOrders.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (sendingIssn.getText().length() == 0) {
					try {
						int year = Integer.parseInt(sendingYear.getText());
						int month = Integer.parseInt(sendingMonth.getText());
						if (isValidDate(month, 1, year)) {
							ArrayList<Subscription> subscriptions = distributor.listAllSendingOrders(year, month);
							if (subscriptions.isEmpty()) {
								listInfo.setText("There is no orders for this date!");
							} else {
								listInfo.setText(subscriptions.toString());
							}
						} else {
							listInfo.setText("Date format wrong!");
						}
					} catch (NumberFormatException err) {
						listInfo.setText("You have to write a number!");
					}

				} else {
					try {
						int year = Integer.parseInt(sendingYear.getText());
						int month = Integer.parseInt(sendingMonth.getText());
						if (isValidDate(month, 1, year)) {
							ArrayList<Subscription> subscriptions = distributor.listSendingOrders(sendingIssn.getText(),
									year, month);
							if (subscriptions.isEmpty()) {
								listInfo.setText("There is no orders for this date!");
							} else {
								listInfo.setText(subscriptions.toString());
							}
						} else {
							listInfo.setText("Date format wrong!");
						}
					} catch (NumberFormatException err) {
						listInfo.setText("You have to write a number!");
					}
				}
			}
		});
		listSendingOrders.setBounds(6, 149, 268, 29);
		panel_3_1_1.add(listSendingOrders);

		JButton listIncompletePayments = new JButton("List Incomplete Payments");
		listIncompletePayments.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				ArrayList<Subscription> incompletePayments = distributor.listIncompletePayments();
				if (!incompletePayments.isEmpty()) {
					String str = "";
					for (Subscription subscription : incompletePayments) {
						str += subscription.toString() + "\n\n";
					}
					listInfo.setText(str);
				} else {
					listInfo.setText("There is no incomplete payment!");
				}
			}
		});
		listIncompletePayments.setBounds(6, 190, 268, 29);
		panel_3_1_1.add(listIncompletePayments);

		paymentJournalIssn = new JTextField();
		paymentJournalIssn.setColumns(10);
		paymentJournalIssn.setBounds(148, 26, 130, 26);
		panel_5.add(paymentJournalIssn);

		JLabel lblNewLabel_4_2_1 = new JLabel("Journal Issn:");
		lblNewLabel_4_2_1.setBounds(6, 31, 130, 16);
		panel_5.add(lblNewLabel_4_2_1);

		paymentSubscriberName = new JTextField();
		paymentSubscriberName.setColumns(10);
		paymentSubscriberName.setBounds(148, 52, 130, 26);
		panel_5.add(paymentSubscriberName);

		JLabel lblNewLabel_4_1_1_1 = new JLabel("Subscriber Name:");
		lblNewLabel_4_1_1_1.setBounds(6, 57, 130, 16);
		panel_5.add(lblNewLabel_4_1_1_1);

		JLabel lblNewLabel_11 = new JLabel("Pay Subscription");
		lblNewLabel_11.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_11.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_11.setBounds(6, 6, 272, 16);
		panel_5.add(lblNewLabel_11);

		JLabel lblNewLabel_8_1 = new JLabel("Discount Ratio:");
		lblNewLabel_8_1.setBounds(6, 80, 107, 16);
		panel_5.add(lblNewLabel_8_1);

		paymentDiscountRatio = new JTextField();
		paymentDiscountRatio.setColumns(10);
		paymentDiscountRatio.setBounds(148, 75, 130, 26);
		panel_5.add(paymentDiscountRatio);

		JLabel lblNewLabel_8_1_1 = new JLabel("Amount: ");
		lblNewLabel_8_1_1.setBounds(6, 101, 107, 16);
		panel_5.add(lblNewLabel_8_1_1);

		JLabel paymentInfo = new JLabel("");
		paymentInfo.setFont(new Font("Lucida Grande", Font.PLAIN, 11));
		paymentInfo.setHorizontalAlignment(SwingConstants.CENTER);
		paymentInfo.setBounds(6, 151, 272, 22);
		panel_5.add(paymentInfo);

		paymentAmount = new JTextField();
		paymentAmount.setColumns(10);
		paymentAmount.setBounds(148, 96, 130, 26);
		panel_5.add(paymentAmount);

		JLabel paymentBillingInfo = new JLabel("");
		paymentBillingInfo.setFont(new Font("Lucida Grande", Font.PLAIN, 11));
		paymentBillingInfo.setHorizontalAlignment(SwingConstants.CENTER);
		paymentBillingInfo.setBounds(6, 170, 272, 52);
		panel_5.add(paymentBillingInfo);
		panel_4.setLayout(null);

		JButton paySubscription = new JButton("Pay");
		paySubscription.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (paymentAmount.getText().length() == 0 || paymentDiscountRatio.getText().length() == 0
						|| paymentSubscriberName.getText().length() == 0
						|| paymentJournalIssn.getText().length() == 0) {
					paymentInfo.setText("You have to fill all required fields!");
				} else {
					try {
						double doublePaymentAmount = Double.parseDouble(paymentAmount.getText());
						double discountRatio = Double.parseDouble(paymentDiscountRatio.getText());
						ArrayList<Subscription> subscriptions = distributor
								.listSubscriptions(paymentSubscriberName.getText());
						if (subscriptions != null) {
							Subscription subscription = null;
							for (Subscription sub : subscriptions) {
								if (sub.getJournal().getIssn().equals(paymentJournalIssn.getText())) {
									subscription = sub;
								}
							}
							if (subscription != null) {
								if (subscription.getPayment() != null) {
									if (subscription.acceptPayment(doublePaymentAmount)) {
										if (subscription.getPayment().getDiscountRatio() != discountRatio) {
											paymentInfo.setText(
													"<html>Payment received successfuly!<br>You cannot change discount ratio!</html>");
										} else {
											if (subscription.getPayment()
													.getReceivedPayment() == subscription.getCopies() * (subscription
															.getJournal().getIssuePrice()
															* (1 - subscription.getPayment().getDiscountRatio()))) {
												paymentInfo.setText("Journal cost has been completed!");
											} else {
												paymentInfo.setText("Payment received successfuly!");
											}
											paymentInfo.setText("Payment received successfuly!");
											paymentBillingInfo.setText("<html>Billing Information:<br>"
													+ subscription.getSubscriber().getBillingInformation() + "</html>");
										}
									} else {
										paymentInfo.setText("You cannot pay over the issue price!");
									}

								} else {
									PaymentInfo payment = new PaymentInfo(doublePaymentAmount, discountRatio);
									if (subscription.setPayment(payment)) {
										if (subscription.getPayment().getReceivedPayment() == subscription.getCopies()
												* (subscription.getJournal().getIssuePrice()
														* (1 - subscription.getPayment().getDiscountRatio()))) {
											paymentInfo.setText("Journal cost has been completed!");
										} else {
											paymentInfo.setText("First payment received successfuly!");
										}
										paymentBillingInfo.setText("<html>Billing Information:<br>"
												+ subscription.getSubscriber().getBillingInformation() + "</html>");
									} else {
										paymentInfo.setText("You cannot pay over the issue price!");
									}
								}
							} else {
								paymentInfo.setText("This subscriber did not subscribe for this journal!");
							}
						} else {
							paymentInfo.setText("There is no subscriber with this name!");
						}
					} catch (NumberFormatException err) {
						paymentInfo.setText("You have to write a number!");
					}
				}
			}
		});
		paySubscription.setBounds(6, 119, 272, 29);
		panel_5.add(paySubscription);

		JLabel lblNewLabel_7 = new JLabel("Create Subscription");
		lblNewLabel_7.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_7.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_7.setBounds(6, 6, 274, 16);
		panel_4.add(lblNewLabel_7);

		JLabel lblNewLabel_4_2 = new JLabel("Journal Issn:");
		lblNewLabel_4_2.setBounds(6, 39, 130, 16);
		panel_4.add(lblNewLabel_4_2);

		subscriptionCopies = new JTextField();
		subscriptionCopies.setBounds(148, 95, 130, 26);
		panel_4.add(subscriptionCopies);
		subscriptionCopies.setColumns(10);

		subscriptionJournalIssn = new JTextField();
		subscriptionJournalIssn.setColumns(10);
		subscriptionJournalIssn.setBounds(148, 34, 130, 26);
		panel_4.add(subscriptionJournalIssn);

		subscriptionYear = new JTextField();
		subscriptionYear.setColumns(10);
		subscriptionYear.setBounds(148, 151, 126, 26);
		panel_4.add(subscriptionYear);

		subscriptionSubscriberName = new JTextField();
		subscriptionSubscriberName.setColumns(10);
		subscriptionSubscriberName.setBounds(148, 67, 130, 26);
		panel_4.add(subscriptionSubscriberName);

		subscriptionMonth = new JTextField();
		subscriptionMonth.setColumns(10);
		subscriptionMonth.setBounds(148, 123, 126, 26);
		panel_4.add(subscriptionMonth);

		JLabel lblNewLabel_4_1_1 = new JLabel("Subscriber Name:");
		lblNewLabel_4_1_1.setBounds(6, 72, 130, 16);
		panel_4.add(lblNewLabel_4_1_1);

		JLabel lblNewLabel_8 = new JLabel("Copies:");
		lblNewLabel_8.setBounds(6, 100, 61, 16);
		panel_4.add(lblNewLabel_8);

		JLabel createSubscriptionInfo = new JLabel("");
		createSubscriptionInfo.setHorizontalAlignment(SwingConstants.CENTER);
		createSubscriptionInfo.setBounds(6, 216, 274, 16);
		panel_4.add(createSubscriptionInfo);
		panel_3.setLayout(null);

		JButton createSubscription = new JButton("Create");
		createSubscription.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (subscriptionJournalIssn.getText().length() == 0
						|| subscriptionSubscriberName.getText().length() == 0
						|| subscriptionCopies.getText().length() == 0 || subscriptionMonth.getText().length() == 0
						|| subscriptionYear.getText().length() == 0) {
					createSubscriptionInfo.setText("You have to fill all required fields!");
				} else {
					try {
						int startMonth = Integer.parseInt(subscriptionMonth.getText());
						int startYear = Integer.parseInt(subscriptionYear.getText());
						int copies = Integer.parseInt(subscriptionCopies.getText());
						if (isValidDate(startMonth, 1, startYear)) {
							Journal journal = distributor.searchJournal(subscriptionJournalIssn.getText());
							if (journal != null) {
								Subscriber subscriber = distributor
										.searchSubscriber(subscriptionSubscriberName.getText());
								if (subscriber != null) {
									DateInfo dates = new DateInfo(startMonth, startYear);
									Subscription subscription = new Subscription(dates, copies, journal, subscriber);
									if (distributor.addSubscription(journal.getIssn(), subscriber, subscription)) {
										createSubscriptionInfo.setText("Subscription has been created successfully!");
									} else {
										createSubscriptionInfo.setText("Something went wrong!");
									}
								} else {
									createSubscriptionInfo.setText("There is no subscriber with this name!");
								}
							} else {
								createSubscriptionInfo.setText("There is no journal with this issn!");
							}
						} else {
							createSubscriptionInfo.setText("Date format wrong!");
						}
					} catch (NumberFormatException err) {
						createSubscriptionInfo.setText("You have to write a number!");
					}

				}
			}
		});
		createSubscription.setBounds(6, 189, 274, 29);
		panel_4.add(createSubscription);

		JLabel lblNewLabel_9_2 = new JLabel("Month");
		lblNewLabel_9_2.setBounds(6, 128, 78, 16);
		panel_4.add(lblNewLabel_9_2);

		JLabel lblNewLabel_9_1_1 = new JLabel("Year");
		lblNewLabel_9_1_1.setBounds(6, 156, 48, 16);
		panel_4.add(lblNewLabel_9_1_1);

		JLabel lblNewLabel_4 = new JLabel("Journal Issn:");
		lblNewLabel_4.setBounds(6, 6, 130, 16);
		panel_3.add(lblNewLabel_4);

		searchSubscriberName = new JTextField();
		searchSubscriberName.setColumns(10);
		searchSubscriberName.setBounds(148, 34, 196, 26);
		panel_3.add(searchSubscriberName);

		JTextPane searchJournalInfo = new JTextPane();
		searchJournalInfo.setBounds(6, 95, 510, 69);
		panel_3.add(searchJournalInfo);

		JTextPane searchSubscriberInfo = new JTextPane();
		searchSubscriberInfo.setBounds(6, 191, 510, 86);
		panel_3.add(searchSubscriberInfo);

		searchJournalIssn = new JTextField();
		searchJournalIssn.setBounds(148, 1, 196, 26);
		panel_3.add(searchJournalIssn);
		searchJournalIssn.setColumns(10);

		JLabel lblNewLabel_4_1 = new JLabel("Subscriber Name:");
		lblNewLabel_4_1.setBounds(6, 39, 130, 16);
		panel_3.add(lblNewLabel_4_1);

		JLabel lblNewLabel_5 = new JLabel("Subscriber Info");
		lblNewLabel_5.setBounds(6, 170, 117, 16);
		panel_3.add(lblNewLabel_5);

		JButton searchSubscriber = new JButton("Search");
		searchSubscriber.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (searchSubscriberName.getText().length() > 0) {
					Subscriber subscriber = distributor.searchSubscriber(searchSubscriberName.getText());
					if (subscriber != null) {
						searchSubscriberInfo.setText(subscriber.toString());
						searchSubscriberName.setText("");
					} else {
						searchSubscriberInfo.setText("There is no subscriber with this name!");
					}
				}
			}
		});
		searchSubscriber.setBounds(383, 34, 117, 29);
		panel_3.add(searchSubscriber);

		JButton searchJournal = new JButton("Search");
		searchJournal.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (searchJournalIssn.getText().length() > 0) {
					Journal journal = distributor.searchJournal(searchJournalIssn.getText());
					if (journal != null) {
						searchJournalInfo.setText(journal.toString());
						searchJournalIssn.setText("");
					} else {
						searchJournalInfo.setText("There is no journal with this issn!");
					}
				}
			}
		});
		searchJournal.setBounds(383, 1, 117, 29);
		panel_3.add(searchJournal);

		JLabel lblNewLabel_6 = new JLabel("Journal Info");
		lblNewLabel_6.setBounds(6, 75, 102, 16);
		panel_3.add(lblNewLabel_6);
		panel_2.setLayout(null);

		JLabel lblNewLabel_2 = new JLabel("Create New Subscriber");
		lblNewLabel_2.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_2.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_2.setBounds(6, 6, 319, 16);
		panel_2.add(lblNewLabel_2);

		subscriberName = new JTextField();
		subscriberName.setColumns(10);
		subscriberName.setBounds(48, 34, 95, 26);
		panel_2.add(subscriberName);

		JLabel lblNewLabel_3 = new JLabel("Name:");
		lblNewLabel_3.setBounds(6, 39, 61, 16);
		panel_2.add(lblNewLabel_3);

		JLabel label12 = new JLabel("Address:");
		label12.setBounds(153, 39, 61, 16);
		panel_2.add(label12);

		subscriberAddress = new JTextField();
		subscriberAddress.setColumns(10);
		subscriberAddress.setBounds(220, 34, 130, 26);
		panel_2.add(subscriberAddress);

		JRadioButton individualBtn = new JRadioButton("Individual");
		individualBtn.setSelected(true);
		individualBtn.setBounds(6, 72, 141, 23);
		panel_2.add(individualBtn);

		JRadioButton corporationBtn = new JRadioButton("Corporation");
		corporationBtn.setBounds(209, 72, 141, 23);
		panel_2.add(corporationBtn);
		panel_1.setLayout(null);
		ButtonGroup group = new ButtonGroup();
		group.add(corporationBtn);
		group.add(individualBtn);

		JPanel dynamicPanel = new JPanel(new CardLayout());
		dynamicPanel.setSize(340, 93);
		dynamicPanel.setLocation(10, 100);
		panel_2.add(dynamicPanel);

		JPanel corporationPanel = new JPanel();
		dynamicPanel.add(corporationPanel, "Corporation");
		corporationPanel.setLayout(null);
		JLabel label_3 = new JLabel("Bank Code:");
		label_3.setBounds(6, 5, 70, 16);
		corporationPanel.add(label_3);
		JTextField accountNumber = new JTextField(10);
		accountNumber.setBounds(117, 57, 65, 26);
		corporationPanel.add(accountNumber);
		JTextField bankName = new JTextField(10);
		bankName.setBounds(81, 28, 101, 26);
		corporationPanel.add(bankName);
		JTextField bankCode = new JTextField(10);
		bankCode.setBounds(81, 0, 101, 26);
		corporationPanel.add(bankCode);
		JTextField issueDay = new JTextField(10);
		issueDay.setBounds(281, 0, 60, 26);
		corporationPanel.add(issueDay);
		JTextField issueYear = new JTextField(10);
		issueYear.setBounds(281, 57, 60, 26);
		corporationPanel.add(issueYear);
		JTextField issueMonth = new JTextField(10);
		issueMonth.setBounds(281, 28, 60, 26);
		corporationPanel.add(issueMonth);
		JLabel label_1 = new JLabel("Bank Name:");
		label_1.setBounds(6, 33, 74, 16);
		corporationPanel.add(label_1);
		JLabel label_5 = new JLabel("Issue Day:");
		label_5.setBounds(194, 5, 65, 16);
		corporationPanel.add(label_5);
		JLabel label_4 = new JLabel("Issue Month:");
		label_4.setBounds(194, 33, 81, 16);
		corporationPanel.add(label_4);
		JLabel label_2 = new JLabel("Issue Year:");
		label_2.setBounds(194, 61, 68, 16);
		corporationPanel.add(label_2);
		JLabel label = new JLabel("Account Number:");
		label.setBounds(6, 62, 110, 16);
		corporationPanel.add(label);

		JPanel individualPanel = new JPanel();
		individualPanel.setBackground(new Color(238, 238, 238));
		individualPanel.setLayout(null);
		JTextField expireYear = new JTextField(10);
		expireYear.setBounds(97, 29, 87, 26);
		individualPanel.add(expireYear);
		JTextField ccv = new JTextField(10);
		ccv.setBounds(196, 29, 130, 26);
		individualPanel.add(ccv);
		JTextField expireMonth = new JTextField(10);
		expireMonth.setBounds(101, 1, 83, 26);
		individualPanel.add(expireMonth);
		JLabel label_7 = new JLabel("Expire Month:");
		label_7.setBounds(6, 6, 87, 16);
		individualPanel.add(label_7);
		JLabel label_8 = new JLabel("Expire Year:");
		label_8.setBounds(6, 34, 74, 16);
		individualPanel.add(label_8);
		JLabel label_9 = new JLabel("CCV:");
		label_9.setBounds(196, 11, 30, 16);
		individualPanel.add(label_9);
		dynamicPanel.add(individualPanel, "Individual");
		JLabel label_6 = new JLabel("Credit Card Number:");
		label_6.setBounds(6, 67, 129, 16);
		individualPanel.add(label_6);
		JTextField creditCardNr = new JTextField(10);
		creditCardNr.setBounds(161, 62, 173, 26);
		individualPanel.add(creditCardNr);
		((CardLayout) dynamicPanel.getLayout()).show(dynamicPanel, "Individual");
		ItemListener itemListener = new ItemListener() {
			@Override
			public void itemStateChanged(ItemEvent e) {
				CardLayout cardLayout = (CardLayout) dynamicPanel.getLayout();
				if (individualBtn.isSelected()) {
					cardLayout.show(dynamicPanel, "Individual");
				} else if (corporationBtn.isSelected()) {
					cardLayout.show(dynamicPanel, "Corporation");
				}
			}
		};

		individualBtn.addItemListener(itemListener);
		corporationBtn.addItemListener(itemListener);

		JLabel subscriberInfo = new JLabel("");
		subscriberInfo.setHorizontalAlignment(SwingConstants.CENTER);
		subscriberInfo.setBounds(6, 220, 344, 16);
		panel_2.add(subscriberInfo);

		JButton createSubscriber = new JButton("Create");
		createSubscriber.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (subscriberName.getText().length() == 0 || subscriberAddress.getText().length() == 0) {
					subscriberInfo.setText("You have to fill all required fields!");
				} else {
					if (individualBtn.isSelected()) {
						if ((creditCardNr.getText().length() == 0 || expireMonth.getText().length() == 0
								|| expireYear.getText().length() == 0 || ccv.getText().length() == 0)) {
							subscriberInfo.setText("You have to fill all required fields!");
						} else {
							try {
								int year = Integer.parseInt(expireYear.getText());
								int month = Integer.parseInt(expireMonth.getText());
								int ccvInt = Integer.parseInt(ccv.getText());
								if (isValidDate(month, 1, year)) {
									Individual subscriber = new Individual(subscriberName.getText(),
											subscriberAddress.getText(), creditCardNr.getText(), month, year, ccvInt);
									if (distributor.addSubscriber(subscriber)) {
										subscriberInfo.setText("Individual Subscriber has been created successfully");
									} else {
										subscriberInfo.setText("Something went wrong!");
									}
								} else {
									subscriberInfo.setText("Date format inccorect!");
								}
							} catch (NumberFormatException err) {
								subscriberInfo.setText("You have to write a number!");
							}

						}
					} else if (corporationBtn.isSelected()) {
						if (bankCode.getText().length() == 0 || bankName.getText().length() == 0
								|| accountNumber.getText().length() == 0 || issueDay.getText().length() == 0
								|| issueMonth.getText().length() == 0 || issueYear.getText().length() == 0) {
							subscriberInfo.setText("You have to fill all required fields!");
						} else {
							try {
								int intBankCode = Integer.parseInt(bankCode.getText());
								int intIssueDay = Integer.parseInt(issueDay.getText());
								int intIssueMonth = Integer.parseInt(issueMonth.getText());
								int intIssueYear = Integer.parseInt(issueYear.getText());
								int intAccountNumber = Integer.parseInt(accountNumber.getText());

								if (isValidDate(intIssueMonth, intIssueDay, intIssueYear)) {
									Corporation subscriber = new Corporation(subscriberName.getText(),
											subscriberAddress.getText(), intBankCode, intIssueDay, intIssueMonth,
											intIssueYear, intAccountNumber, bankName.getText());
									if (distributor.addSubscriber(subscriber)) {
										subscriberInfo.setText("Corporation Subscriber has been created successfully");
									} else {
										subscriberInfo.setText("Something went wrong!");
									}
								} else {
									subscriberInfo.setText("Date format incorrect!");
								}
							} catch (NumberFormatException err) {
								subscriberInfo.setText("You have to write a number!");
							}
						}
					}
				}
			}
		});
		createSubscriber.setBounds(6, 194, 344, 29);
		panel_2.add(createSubscriber);

		journalName = new JTextField();
		journalName.setColumns(10);
		journalName.setBounds(79, 32, 166, 26);
		panel_1.add(journalName);

		journalIssn = new JTextField();
		journalIssn.setColumns(10);
		journalIssn.setBounds(79, 65, 166, 26);
		panel_1.add(journalIssn);

		journalFrequency = new JTextField();
		journalFrequency.setColumns(10);
		journalFrequency.setBounds(79, 98, 166, 26);
		panel_1.add(journalFrequency);

		journalIssuePrice = new JTextField();
		journalIssuePrice.setColumns(10);
		journalIssuePrice.setBounds(79, 127, 166, 26);
		panel_1.add(journalIssuePrice);

		JLabel lblNewLabel = new JLabel("Name:");
		lblNewLabel.setBounds(6, 37, 61, 16);
		panel_1.add(lblNewLabel);

		JLabel lblIssn = new JLabel("Issn:");
		lblIssn.setBounds(6, 70, 61, 16);
		panel_1.add(lblIssn);

		JLabel lblFrequency = new JLabel("Frequency:");
		lblFrequency.setBounds(6, 103, 75, 16);
		panel_1.add(lblFrequency);

		JLabel lblIssuePrice = new JLabel("Issue Price:");
		lblIssuePrice.setBounds(6, 132, 75, 16);
		panel_1.add(lblIssuePrice);

		JLabel journalInfo = new JLabel("");
		journalInfo.setHorizontalAlignment(SwingConstants.CENTER);
		journalInfo.setBounds(6, 189, 239, 16);
		panel_1.add(journalInfo);

		JButton btnNewButton = new JButton("Create");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (journalName.getText().length() == 0 || journalIssn.getText().length() == 0
						|| journalFrequency.getText().length() == 0 || journalIssuePrice.getText().length() == 0) {
					journalInfo.setText("You have to fill all required fields!");
				} else {
					try {
						int frequency = Integer.parseInt(journalFrequency.getText());
						double issuePrice = Double.parseDouble(journalIssuePrice.getText());
						Journal journal = new Journal(journalName.getText(), journalIssn.getText(), frequency,
								issuePrice);
						if (distributor.addJournal(journal)) {
							journalInfo.setText("Journal has been created succesfully!");
							journalName.setText("");
							journalIssn.setText("");
							journalFrequency.setText("");
							journalIssuePrice.setText("");

						} else {
							journalInfo.setText("This ıssn number already exist!");
						}
					} catch (NumberFormatException err) {
						journalInfo.setText("You have to write a number!");
					}
				}
			}
		});
		btnNewButton.setBounds(0, 159, 245, 29);
		panel_1.add(btnNewButton);

		JLabel lblNewLabel_1 = new JLabel("Create New Journal");
		lblNewLabel_1.setFont(new Font("Lucida Grande", Font.BOLD, 16));
		lblNewLabel_1.setHorizontalAlignment(SwingConstants.CENTER);
		lblNewLabel_1.setBounds(6, 6, 239, 16);
		panel_1.add(lblNewLabel_1);
		panel.setLayout(gl_panel);

	}

	private boolean isValidDate(int month, int day, int year) {
		if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
			return false;
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
		dateFormat.setLenient(false);

		try {
			dateFormat.parse(month + "/" + day + "/" + year);
			return true;
		} catch (ParseException e) {
			return false;
		}
	}
}
