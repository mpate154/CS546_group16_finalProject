# 💰 Budget Tracker - Final Project

## 👥 Contributors
- [Elina Rezaeian](https://github.com/erezaeia)
- [Nastaran Soofi](https://github.com/NastaranSoofi)
- [Samantha York](https://github.com/sammyork)
- [Maya Patel](https://github.com/mpate154)

## 📌 Table of Contents
- Project Overview
- Features
- Tech Stack
- Installation
- Usage

---

## 🧾 Project Overview
Brief description of the project:
- Our Budget Tracker aims to make an intuitive yet useful tracker for anyone over the age of 12! Our data visualizations of monthly and yearly summaries make it simple to understand how you utilize your money. 
- This is a final project (though not final rendition) for CS 546 at Steven's Institute of Technology. We hope to expand this application into one we can use ourselves. 

---

## ✨ Features
- Add, edit, delete income and expenses
    - includes an optional description field so you can keep track of specific information
- Categorize transactions (e.g., Food, Rent, Travel)
    - Comes with starter categories 
    - Add and delete your personalized categories
- Visual monthly and yearly summaries with charts and stats
- See pie chart without certain categories by clicking it
- Add fixed expenses for current month 
- Edit personal information

## 🛠 Tech Stack
- **Frontend**: HTML, CSS, Handlebars
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Tools**: Axios, XSS, Bcrypt

---

## 🚀 Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/CS546_group16_finalProject.git
    cd CS546_group16_finalProject
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
4. Visit `http://localhost:3000` in your browser.
    - **Important note: the month selection feature on the income and expense pages only works on Chrome and Microsoft Edge, NOT Safari and FireFox.**
---

## 🧑‍💻 Usage
- Create an account and login
- Add incomes/expenses by clicking on the income/expense tab. (First "add income" on Macs doesn't seem to show up unless you refresh the page)
    - Specify the amount earned/spent.
    - Add the date of the transaction (Dates before the year 2000 and after the current day are not allowed).
    - For expenses, specify the category.
    - (Optional) Add a description to precisely log your transaction. 
- Edit and delete incomes/expenses by clicking the icons in the table next to the specific transaction.
    - For edit, a form will appear with prefilled information. You can edit the income/expense, then hit submit. Go to the corresponding month to see the change. If you no longer want to edit, you can click the cancel button on the form. Then, any changes that were made in the form will not be applied.
    - For delete, that income/expense will immediately disappear from the table. 
- View your monthly and yearly summaries by navigating to the home page. Use the top navbar to toggle between the two summaries.
    - Click a category in the pie chart if you wish to view the chart without that category!
    - Fixed expenses are included in the monthly summary but not in the yearly summary 
- Adjust personal preferences in settings
    - Change your name, email, gender, age, city, state, and starting balance by clicking the "edit information" button. Once your changes are made, click the "save changes" button. If you no longer wish to edit this information, click "edit information" once again.
    - Note: If you change your age to below 13, it will not save as those under 13 are not permitted to use our app.
    - Add fixed expenses, their category, and amount. These are assumed to be monthly fixed expenses for the current month. 
    - Add or remove categories. 
---

## 🔨 Future Improvement
- Overall design/UI
- Add credit card features (multiple accounts tracked)
- Create a seperate database to track fixed expenses for more than just the current month
