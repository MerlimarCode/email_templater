### **Take-Home Challenge: Email Templating Tool in Replit**

**Overview:**

Your task is to build a simple web-based tool that takes in an email (or multiple emails), processes it, and returns a templated version using predefined variables. The tool should handle long emails and batches of emails efficiently, while preserving the original formatting.

---

### **Challenge Requirements:**

1. **Web Interface:**
   - Build a web page where users can:
     - Paste an email (or batch of emails).
     - Click **Submit** to process the email(s).
     - See the output with template variables inserted.

2. **Email Processing:**
   - Replace key details in the emails with predefined template variables (e.g., customer names, order numbers).
   - Ensure that the email formatting and structure are preserved after processing.

3. **Handling Large Inputs:**
   - Your solution must handle long emails and multiple emails at once, maintaining performance and accuracy.

4. **Template Variables:**
   - Replace the appropriate details in the emails with the following variables:
     - `{{company_name}}`
     - `{{support_email}}`
     - `{{customer_name}}`
     - `{{full_name}}`
     - `{{shipping_address}}`
     - `{{order_number}}`
     - `{{products}}`
     - `{{items}}`
     - `{{quantity}}`
     - `{{product_name}}`
     - `{{tracking_number}}`
     - `{{shipping_carrier}}`
     - `{{ordered_at}}`
     - `{{address}}`

---

### **Example Emails:**

#### **1. Abandoned Cart Email:**
```plaintext
Subject: Don't forget about your Archimedes Products order!
Dear Yin Wu,

We noticed you left some items in your cart:
- Table Cap, Quantity: 2
- Token Distributor, Quantity: 1

Best regards,  
The Archimedes Products Team
```

#### **2. Order Confirmation Email:**
```plaintext
Subject: Order Confirmation - Archimedes Products Order #O2024
Dear Yin Wu,

Thank you for your order!  
Order Number: O2024  
Items Ordered:  
- Table Cap, Quantity: 2  
- Token Distributor, Quantity: 1

Best regards,  
The Archimedes Products Team
```

---

### **Getting Started:**

1. **Fork the Replit Project:**
   - You can use any language or framework.

2. **Build the Tool:**
   - Implement the ability to paste and process emails, replacing key details with template variables.

3. **Submission:**
   - Share your Replit link (public or private), and we’ll test it by pasting sample emails and reviewing the output and code.

---

### **Evaluation Criteria:**

1. **Correct Use of Variables:** Insert the correct template variables in the right places.
2. **Preservation of Formatting:** The output should match the original email’s structure and formatting.
3. **Handling Large Emails:** Your solution must handle long emails or batches of emails smoothly.
4. **User Experience:** The web interface should be simple and easy to use.

---

**Good luck! We look forward to testing your solution on Replit.**