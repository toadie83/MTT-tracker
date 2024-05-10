// Variables to store running total and list of entries
let total = 0;
const entries = [];

// Function to update the running total display
function updateTotal() {
  const totalElement = document.getElementById("total");
  totalElement.textContent = `$${total.toFixed(2)}`;
}
// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  // Get the amount entered by the user
  const amountInput = document.getElementById("amount");
  const amount = parseFloat(amountInput.value);

  // Get the selected type (buy-in or cashout)
  const typeSelection = document.querySelector(
    'input[name="type"]:checked'
  ).value;

  // Check if the amount is valid
  if (isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  // Determine if it's a buy-in or cashout and adjust the amount accordingly
  const type = typeSelection === "buyin" ? "Buy-in" : "Cashout";
  const adjustedAmount = typeSelection === "buyin" ? -amount : amount;

  // Update the running total
  total += adjustedAmount;

  // Log the entry with current date
  const entry = {
    date: new Date().toLocaleDateString(),
    amount: adjustedAmount,
    type: type,
  };
  entries.push(entry);

  // Update the display
  updateTotal();
  displayEntries();

  // Clear the input field
  amountInput.value = "";
}

// Function to format date to UK format (DD/MM/YYYY)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to display entries
function displayEntries() {
  const entryList = document.getElementById("entryList");
  entryList.innerHTML = "";

  entries.forEach((entry) => {
    const formattedDate = formatDate(new Date(entry.date));
    const listItem = document.createElement("li");
    listItem.textContent = `${formattedDate} - ${
      entry.type
    }: $${entry.amount.toFixed(2)}`;
    entryList.appendChild(listItem);
  });
}

// Event listener for form submission
const entryForm = document.getElementById("entryForm");
entryForm.addEventListener("submit", handleSubmit);

// Initial display
updateTotal();
displayEntries();
