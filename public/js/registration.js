const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

function showError(message) {

  document.querySelectorAll('.client-error').forEach(e => e.remove());

  let errorP = document.createElement('p');
  errorP.style.color = 'red';
  errorP.style.textAlign = 'center';
  errorP.innerText = message;
  errorP.classList.add('client-error'); 

  let heading = document.querySelector('h1');
  if (heading) {
    heading.insertAdjacentElement('afterend', errorP);
  } else {
    document.body.prepend(errorP);
  }
}

if (signinForm) {
  signinForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    if (!email) {
      showError('Email is required.');
      document.getElementById('password').value = '';
      return;
    }

    if (typeof email !== "string" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      showError('Invalid email format.');
      document.getElementById('password').value = '';
      return;
    }
    if (!password) {
      showError('Password is required.');
      document.getElementById('password').value = '';
      return;
    }

    if (password.length < 8 || /\s/.test(password) ||
      !/[A-Z]/.test(password) || !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>[\]\\;'/\-=_+`~]/.test(password)
    ) {
      showError('Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character.');
      document.getElementById('password').value = '';
      return;
    }
    signinForm.submit();

    // fetch('/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ email, password })
    // })
    //   .then(response => {
    //     if (response.ok) {
    //       window.location.href = '/home';
    //     } else {
    //       response.text().then(msg => {
    //         showError(msg || 'Login failed. Please try again.');
    //         document.getElementById('password').value = ''; // Clear password
    //       });
    //     }
    //   })
    //   .catch(() => {
    //     showError('Network error. Please try again.');
    //     document.getElementById('password').value = ''; // Clear password
    //   });
    
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const balance = document.getElementById('balance').value.trim();
    let password = document.getElementById('password').value.trim();
    let confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!firstName || firstName.length < 2 || firstName.length > 20 || !/^[a-zA-Z]+$/.test(firstName)) {
      showError('First Name must be 2-20 characters long and only contain letters.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';

      return;
    }

    if (!lastName || lastName.length < 2 || lastName.length > 20 || !/^[a-zA-Z]+$/.test(lastName)) {
      showError('Last Name must be 2-20 characters long and only contain letters.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';

      return;
    }

    if (!email || typeof email !== "string" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      showError('Invalid email format.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (!age || isNaN(age) || parseInt(age) < 1) {
      showError('Age must be a valid number.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
      showError('City should only contain letters.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (!state || !/^[a-zA-Z\s]+$/.test(state)) {
      showError('State should only contain letters.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (!balance || isNaN(balance) || parseFloat(balance) < 0) {
      showError('Balance should be a valid positive number.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (!password || password.length < 8 || /\s/.test(password) ||
      !/[A-Z]/.test(password) || !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>[\]\\;'/\-=_+`~]/.test(password)
    ) {
      showError('Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      return;
    }

    signupForm.submit();

    // fetch('/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     firstName,
    //     lastName,
    //     email,
    //     gender,
    //     age,
    //     city,
    //     state,
    //     balance,
    //     password
    //   })
    // })
    //   .then(response => {
    //     if (response.ok) {
    //       window.location.href = '/login';
    //     } else {
    //       response.text().then(msg => {
    //         showError(msg || 'Registeration failed. Please try again.');
    //         document.getElementById('password').value = '';
    //         document.getElementById('confirmPassword').value = '';
    //       });
    //     }
    //   })
    //   .catch(() => {
    //     showError('Network error. Please try again.');
    //     document.getElementById('password').value = '';
    //     document.getElementById('confirmPassword').value = '';
    //   });
  });
}