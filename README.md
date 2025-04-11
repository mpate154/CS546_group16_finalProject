### 📁 Project Structure

```
controllers/           # Business logic (request handlers)
├── userController.js
├── authController.js
├── transactionController.js
└── summaryController.js

services/              # Reusable logic (DB queries, calculations)
├── userService.js
├── authService.js
├── transactionService.js
└── summaryService.js

models/                # Mongoose schemas
├── User.js
├── Transaction.js
├── MonthlySummary.js
└── YearlySummary.js

routes/                # Express routes
├── userRoutes.js
├── authRoutes.js
├── transactionRoutes.js
└── summaryRoutes.js

middlewares/           # Authentication and validation middleware
├── authMiddleware.js
└── errorHandler.js

utils/                 # Helper functions
├── hashPassword.js
├── generateToken.js
└── emailSender.js

config/                # App and DB config
└── db.js

validations/           # Request input validation
├── userValidation.js
└── transactionValidation.js

.env                   # Environment variables
app.js                 # Express app entry point
package.json           # NPM metadata
```
