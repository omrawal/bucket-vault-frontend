import React from 'react';
const mockTx = [
  {
    date: '2025-12-01',
    account: 'HDFC Savings',
    type: 'Credit',
    amount: 50000,
    note: 'Salary',
  },
  {
    date: '2025-12-02',
    account: 'Zerodha Equity',
    type: 'Debit',
    amount: 15000,
    note: 'Stock Purchase',
  },
];

function TransactionsPage() {
  return (
    <div className="page">
      <h2 className="page-title">Transactions</h2>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {mockTx.map((t, index) => (
              <tr key={index}>
                <td>{t.date}</td>
                <td>{t.account}</td>
                <td>{t.type}</td>
                <td >
                  {t.amount.toLocaleString('en-IN')}
                </td>
                <td>{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsPage;
