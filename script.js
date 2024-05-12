// Variables to store running total and list of entries
let total = 0;
const entries = [];

// Function to update the running total display
function updateTotal() {
  const totalElement = document.getElementById("total");
  totalElement.textContent = `$${total.toFixed(2)}`;

  // Apply different text color based on the total value
  if (total < 0) {
    totalElement.style.color = "red";
  } else if (total === 0) {
    totalElement.style.color = "black";
  } else {
    totalElement.style.color = "green";
  }
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
// Function to delete an entry
function deleteEntry(index) {
  // Remove the entry from the entries array
  const deletedEntry = entries.splice(index, 1)[0];

  // Update the running total
  total -= deletedEntry.amount;

  // Update the display
  updateTotal();
  displayEntries();
}

// Function to display entries
function displayEntries() {
  const entryList = document.getElementById("entryList");
  entryList.innerHTML = "";

  entries.forEach((entry, index) => {
    const formattedDate = formatDate(new Date(entry.date));
    const listItem = document.createElement("li");
    listItem.textContent = `${formattedDate} - ${
      entry.type
    }: $${entry.amount.toFixed(2)}`;

    // Add a delete button for each entry
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("deleteButton"); // Add delete button class
    deleteButton.addEventListener("click", () => deleteEntry(index));
    listItem.appendChild(deleteButton);

    entryList.appendChild(listItem);
  });
}

// Function to save session data
function saveSession() {
  const now = new Date();
  const sessionReference = `${now.toLocaleDateString(
    "en-GB"
  )} ${now.toLocaleTimeString("en-GB")}`; // Get current date and time as UK format
  const sessionData = {
    entries: entries.slice(), // Copy entries array to avoid modifying the original
    total: total,
  };
  sessionStorage.setItem(sessionReference, JSON.stringify(sessionData));

  // Clear the running total and current entries list
  total = 0;
  entries.length = 0;
  updateTotal();
  displayEntries();

  // Clear the current entries list
  const entryList = document.getElementById("entryList");
  entryList.innerHTML = "";

  // Update the list of session references
  const sessionList = document.getElementById("sessionList");
  const sessionItem = document.createElement("li");
  sessionItem.innerHTML = `<a href="#" class="sessionLink">${sessionReference}</a>`;
  sessionList.appendChild(sessionItem);

  // Add event listener to the session link
  sessionItem
    .querySelector(".sessionLink")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const sessionRef = sessionItem.textContent;
      const sessionData = JSON.parse(sessionStorage.getItem(sessionRef));
      displaySession(sessionData);
    });
}

// Function to display saved session data in a pop-up
function displaySession(sessionData) {
  let sessionInfo = `Session Reference: ${sessionData.entries[0].date}\n\nEntries:\n`;

  // Loop through all entries and add them to sessionInfo
  sessionData.entries.forEach((entry, index) => {
    sessionInfo += `${index + 1}. ${formatDate(new Date(entry.date))} - ${
      entry.type
    }: $${entry.amount.toFixed(2)}\n`;
  });

  sessionInfo += `\nTotal: $${sessionData.total.toFixed(2)}`;

  // Display session info in a pop-up
  alert(sessionInfo);
}

// Event listener for form submission
const entryForm = document.getElementById("entryForm");
entryForm.addEventListener("submit", handleSubmit);

// Event listener for saving session
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", saveSession);

// Initial display
updateTotal();
displayEntries();
