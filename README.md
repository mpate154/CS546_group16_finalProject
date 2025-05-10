### 📁 Project Structure

```
config/                 
├── mongoCollections.js
├── mongoConnections.js
└── setting.js

data/           
├── users.js
├── income.js
├── transactions.js
├── monthlySummary.js
└── yearlySummary.js

public/                 
├── css
    └── styles.js
└── js
    └── form_process.js

routes/                 
├── index.js
└── main.js

static/                 
└── ???

views/               
├── layouts
    └── main.handlebars
├── accounts.handlebars
├── expense.handlebars
├── home.handlebars
├── income.handlebars
├── monthlySummary.handlebars
├── yearlySummary.handlebars
└── settings.handlebars

app.js
helper.js           
package.json           
```

**Notes 
- The "month" input on the income and transaction pages are only supported by chrome and microsoft edge, not safari and firefox. 
- descriptions are optional so if you dont put it any it won't throw an error