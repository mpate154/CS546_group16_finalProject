
📁 controllers/          # Business logic (request handlers)
  ├── userController.js
  ├── authController.js
  ├── transactionController.js
  └── summaryController.js

📁 services/             # DB logic / reusable logic
  ├── userService.js
  ├── authService.js
  ├── transactionService.js
  └── summaryService.js

📁 models/               # Mongoose schemas
  ├── User.js
  ├── Transaction.js
  ├── MonthlySummary.js
  └── YearlySummary.js

📁 routes/               # Express routes
  ├── userRoutes.js
  ├── authRoutes.js
  ├── transactionRoutes.js
  └── summaryRoutes.js

📁 middlewares/          # Auth checks, validators, etc.
  ├── authMiddleware.js
  └── errorHandler.js

📁 utils/                # Helper functions, hashers, formatters
  ├── hashPassword.js
  ├── generateToken.js
  └── emailSender.js

📁 config/               # Database and environment config
  └── db.js

📁 validations/          # Joi or custom input validation logic
  ├── userValidation.js
  └── transactionValidation.js

📁 .env
📁 app.js                # Main entry point for Express
📁 package.json
