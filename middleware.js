export function logger(req,res,next){
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const path = req.path;
  
    let authStatus = 'Non-Authenticated';
  
    if (req.session && req.session.user) {
         authStatus = `Authenticated ${req.session.user.email}`;
    }
    console.log(`[${timestamp}]: ${method} ${path} (${authStatus})`);
    next();
  }
  export function loginRedirect(req, res, next) {
    if (req.method === 'GET' && req.session.user) {
      if (req.path === '/login') {
        console.log("[LOGIN REDIRECT]: User already logged in, redirecting to /home");
        return res.redirect('/home');
      }
    }
    next();
  }
     
  export function registerRedirect(req, res, next) {
    if (req.method === 'GET' && req.session.user) {
      if (req.path === '/register') {
        console.log("[REGISTER REDIRECT]: User already registered, redirecting to /home");
        return res.redirect('/home');
      }
    }
    next();
  }
     
  export function protectHomePage(req, res, next) {
    if (req.method === 'GET' && !req.session.user) {
      console.log("[HOME PROTECTION]: User not logged in, redirecting to /login");
       return res.redirect('/login');
      }
    next();
  }
     
  export function protectSignoutPage(req, res, next) {
    if (req.method === 'GET' && !req.session.user) {
      console.log("[SIGNOUT PROTECTION]: User not logged in, redirecting to /login");
      return res.redirect('/login');
    }
    next();
  }
  
  export function protectIncomePage(req,res, next) {
      if(req.method === 'GET' && !req.session.user) {
          console.log("[INCOME PROTECTION]: User not logged in, redirecting to /login");
          return res.redirect('/login');
      }
      next();
  }
  
  export function protectExpensePage(req,res, next) {
      if(req.method === 'GET' && !req.session.user) {
          console.log("[EXPENSE PROTECTION]: User not logged in, redirecting to /login");
          return res.redirect('/login');
      }
      next();
  }
