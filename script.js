let transactions = [];
let currentTransactionIndex = null;

// Load transactions from localStorage
const savedTransactions = localStorage.getItem('transactions');
if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    updatePersonList();
}

// Add transaction event listener
document.getElementById('transaction-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const personName = document.getElementById('person-name').value;
    const moneyGiven = document.getElementById('money-given').value;
    const transactionDate = document.getElementById('transaction-date').value;

    const newTransaction = {
        personName: personName,
        moneyGiven: moneyGiven,
        transactionDate: transactionDate,
        status: 'pending',
    };

    transactions.push(newTransaction);
    updatePersonList();

    document.getElementById('person-name').value = '';
    document.getElementById('money-given').value = '';
    document.getElementById('transaction-date').value = '';
});

// Update and display the transaction list
function updatePersonList() {
    const personListDiv = document.getElementById('person-list');
    personListDiv.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const { personName, moneyGiven, transactionDate, status } = transaction;

        const transactionElement = document.createElement('div');
        transactionElement.classList.add('transaction-item');

        transactionElement.innerHTML = `
            <div><span>${personName}</span></div>
            <div><span>${moneyGiven}</span></div>
            <div class="date">${transactionDate}</div>
            <div>
                <button class="paid ${status === 'paid' ? 'paid-status' : ''}" onclick="showConfirmation(${index})">
                    ${status === 'paid' ? 'Paid' : '<i class="fas fa-check"></i>'}
                </button>
                <button class="delete" onclick="deleteTransaction(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        personListDiv.appendChild(transactionElement);
    });

    // Save transactions to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Show the confirmation popup when Nike button is clicked
function showConfirmation(index) {
    currentTransactionIndex = index;
    document.getElementById('confirmation-popup').style.display = 'flex';
}

// Confirm paid status and change the Nike icon to "Paid"
document.getElementById('confirm-paid-btn').addEventListener('click', function () {
    const transaction = transactions[currentTransactionIndex];
    if (transaction.status === 'pending') {
        transaction.status = 'paid';  // Mark as paid
        updatePersonList();
    }

    // Close the confirmation popup
    document.getElementById('confirmation-popup').style.display = 'none';
});

// Cancel the popup
document.getElementById('cancel-btn').addEventListener('click', function () {
    document.getElementById('confirmation-popup').style.display = 'none';
});

// Delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updatePersonList();
}

// Search functionality
function searchPersons() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredTransactions = transactions.filter(transaction =>
        transaction.personName.toLowerCase().includes(query)
    );

    const personListDiv = document.getElementById('person-list');
    personListDiv.innerHTML = '';

    filteredTransactions.forEach((transaction, index) => {
        const { personName, moneyGiven, transactionDate, status } = transaction;

        const transactionElement = document.createElement('div');
        transactionElement.classList.add('transaction-item');

        transactionElement.innerHTML = `
            <div><span>${personName}</span></div>
            <div><span>${moneyGiven}</span></div>
            <div class="date">${transactionDate}</div>
            <div>
                <button class="paid ${status === 'paid' ? 'paid-status' : ''}" onclick="showConfirmation(${transactions.indexOf(transaction)})">
                    ${status === 'paid' ? 'Paid' : '<i class="fas fa-check"></i>'}
                </button>
                <button class="delete" onclick="deleteTransaction(${transactions.indexOf(transaction)})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        personListDiv.appendChild(transactionElement);
    });

    const noResultsMessage = document.getElementById('no-results-message');
    if (filteredTransactions.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}

// Show clear transactions popup
document.getElementById('clear-all-btn').addEventListener('click', function() {
    document.getElementById('clear-transactions-popup').style.display = 'flex';
});

// Confirm clear all transactions
document.getElementById('confirm-clear-btn').addEventListener('click', function() {
    localStorage.removeItem('transactions');
    transactions = [];
    updatePersonList();
    document.getElementById('clear-transactions-popup').style.display = 'none';
});

// Cancel clear all transactions
document.getElementById('cancel-clear-btn').addEventListener('click', function() {
    document.getElementById('clear-transactions-popup').style.display = 'none';
});

// Add event listener for search input
document.getElementById('search-bar').addEventListener('input', searchPersons);

// Initial render of the person list
updatePersonList();

