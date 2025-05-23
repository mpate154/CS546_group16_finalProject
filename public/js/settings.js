
function showFormError(message, formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll(".form-error").forEach((e) => e.remove());

  // Create new error message
  const errorP = document.createElement("p");
  errorP.style.color = "red";
  errorP.style.textAlign = "center";
  errorP.style.marginTop = "10px";
  errorP.style.opacity = "0";
  errorP.innerText = message;
  errorP.classList.add("form-error");

  // Insert error message before the form
  form.prepend(errorP);
}

// show the edit form
document
  .getElementById("editInfoButton")
  .addEventListener("click", function () {
    const form = document.getElementById("edit_info_form");
    form.style.display = form.style.display === "none" ? "block" : "none";
});
// edit form ajax and validation
document
  .getElementById("edit_info_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value;
    const age = document.getElementById("age").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const balance = document.getElementById("balance").value.trim();

    if (
      !firstName ||
      firstName.length < 2 ||
      firstName.length > 20 ||
      !/^[a-zA-Z]+$/.test(firstName)
    ) {
      alert('First Name must be 2-20 characters long and only contain letters.');

      return;
    }


    if (
      !lastName ||
      lastName.length < 2 ||
      lastName.length > 20 ||
      !/^[a-zA-Z]+$/.test(lastName)
    ) {
      alert('Last Name must be 2-20 characters long and only contain letters.')
      return;
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      alert('Invalid email format.')
      return;
    }

    if (!age || isNaN(age) || parseInt(age) < 1) {
      alert('Age must be a valid number.');
      return;
    }

    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
      alert('City should only contain letters.');
      return;
    }

    if (!state || !/^[a-zA-Z\s]+$/.test(state)) {
      alert('State should only contain letters.');
      return;
    }

    if (!balance || isNaN(balance) || parseFloat(balance) < 0) {
      alert('Balance should be a valid positive number.');
      return;
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
      city: city,
      state: state,
      age: age,
      balance: balance,
    };

    const response = await fetch(`/settings/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      document.querySelector(".first-name").innerText = `First Name: ${firstName}`;
      document.querySelector(".last-name").innerText = `Last Name: ${lastName}`;
      document.querySelector(".email").innerText = `Email: ${email}`;
      document.querySelector(".gender").innerText = `Gender: ${gender}`;
      document.querySelector(".age").innerText = `Age: ${age}`;
      document.querySelector(".city").innerText = `City: ${city}`;
      document.querySelector(".state").innerText = `State: ${state}`;
      document.querySelector(".balance").innerText = `Balance: $${balance}`;
      document.getElementById("edit_info_form").style.display = "none";
    } else {
      alert("Failed to update user information.");
    }
  });

// AJAX for Adding Category
document
  .getElementById("add_category_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const category = document.getElementById("newCategory").value;

    if (!category) {
      alert('Category is required!');
      return;
    }

    const response = await fetch(`/settings/addCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    });
    if (response.ok) {
      const categoryList = document.getElementById("category_list");
      const li = document.createElement("li");
      li.setAttribute("data-category", category);
      li.innerHTML = `${category} <button class="delete-category">❌</button>`;
      categoryList.appendChild(li);

      const dropdown = document.getElementById("fixedCategory");
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      dropdown.appendChild(option);

      document.getElementById("newCategory").value = "";

      li.querySelector(".delete-category").addEventListener(
        "click",
        async function () {
          await handleDeleteCategory(category, li, option);
        }
      );
    } else {
      alert("Error adding category.");
    }
  });

// Delete Category Logic
const handleDeleteCategory = async (category, liElement, optionElement) => {
  try {
    const response = await fetch(`/settings/deleteCategory`, {

      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),

    });

    if (response.ok) {
      liElement.remove();
      optionElement.remove();
    } else {
      alert("Error deleting category.");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete category.");
  }
};

// Attach delete events to existing categories
document.querySelectorAll(".delete-category").forEach((button) => {
  button.addEventListener("click", async function () {
    const category = this.parentElement.getAttribute("data-category");
    const liElement = this.parentElement;
    const optionElement = document.querySelector(
      `#fixedCategory option[value="${category}"]`
    );

    await handleDeleteCategory(category, liElement, optionElement);
  });
});

// Add New Fixed Expense
document
  .getElementById("add_fixed_expense_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("fixedTitle").value.trim();
    const category = document.getElementById("fixedCategory").value.trim();
    const amount = document.getElementById("fixedAmount").value.trim();

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      alert('Title is required!');
      return;
    }
    if (!amount || amount.trim().length === 0) {
      alert('Amount is required!');
      return;
    }

    const data = {
      title,
      category,
      amount,
    };
    try {
      const response = await fetch(`/settings/addFixedExpense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newExpense = await response.json();

        const list = document.getElementById("fixed_expense_list");
        const li = document.createElement("li");
        li.setAttribute("data-id", newExpense._id);

        li.innerHTML = `
          <span class="expense-title">${newExpense.title}</span> - 
          <span class="expense-category">${newExpense.category}</span> - 
          <span class="expense-amount">$${newExpense.amount.toFixed(2)}</span>
          <button class="edit-expense">✏️</button>
          <button class="delete-expense">❌</button>
        `;

        list.appendChild(li);

        document.getElementById("fixedTitle").value = "";
        document.getElementById("fixedCategory").value = "";
        document.getElementById("fixedAmount").value = "";

        document.querySelectorAll(".form-error").forEach((e) => e.remove());
        li.scrollIntoView({ behavior: "smooth" });
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the expense.')
    }
  });

// Edit and Delete Fixed Expenses
document
  .getElementById("fixed_expense_list")
  .addEventListener("click", async function (event) {
    const target = event.target;
    const li = target.closest("li");
    const id = li.getAttribute("data-id");

    // delete
    if (target.classList.contains("delete-expense")) {
      const response = await fetch(`/settings/deleteFixedExpense/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        li.remove();
      } else {
        alert("Error deleting the expense.");
      }
    }

    // edit
    if (target.classList.contains("edit-expense")) {
      const title = li.querySelector(".expense-title").innerText;
      const category = li.querySelector(".expense-category").innerText;
      const amount = li
        .querySelector(".expense-amount")
        .innerText.replace("$", "");

      li.innerHTML = `
        <input type="text" value="${title}" id="edit-title-${id}">
       <input type="text" value="${category}" id="edit-category-${id}" disabled>
        <input type="text" value="${amount}" id="edit-amount-${id}">
        <button class="save-expense" data-id="${id}">✅</button>
        <button class="cancel-edit" data-id="${id}">❌</button>
      `;
    }
    if (target.classList.contains("save-expense")) {
      const data = {
        title: document.getElementById(`edit-title-${id}`).value,
        category: document.getElementById(`edit-category-${id}`).value,
        amount: document.getElementById(`edit-amount-${id}`).value,
      };

      const response = await fetch(`/settings/updateFixedExpense/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await fetch(`/settings/getFixedExpense/${id}`);

        const updatedExpense = await updatedData.json();

        li.innerHTML = `
          <span class="expense-title">${updatedExpense.title}</span> - 
          <span class="expense-category">${updatedExpense.category}</span> - 
          <span class="expense-amount">$${updatedExpense.amount.toFixed(
            2
          )}</span>
          <button class="edit-expense">✏️</button>
          <button class="delete-expense">❌</button>
        `;
      } else {
        alert("Error updating the expense.");
      }
    }
    if (target.classList.contains("cancel-edit")) {
      const originalData = await fetch(`/settings/getFixedExpense/${id}`);
      const originalExpense = await originalData.json();

      li.innerHTML = `
        <span class="expense-title">${originalExpense.title}</span> - 
        <span class="expense-category">${originalExpense.category}</span> - 
        <span class="expense-amount">$${originalExpense.amount.toFixed(
          2
        )}</span>
        <button class="edit-expense">✏️</button>
        <button class="delete-expense">❌</button>
      `;
    }
  });

