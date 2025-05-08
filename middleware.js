export function protectIncomePage(req, res, next) {
  if (req.method == "GET") {
    if (!req.session.user) {
      return res.redirect("/login");
    }
  }
  next();
}

export function protectExpensePage(req, res, next) {
    if (req.method == "GET") {
      if (!req.session.user) {
        return res.redirect("/login");
      }
    }
    next();
  }