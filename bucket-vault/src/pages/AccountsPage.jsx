import React from 'react';
const mockAccounts = [
  { name: 'HDFC Savings', type: 'Bank', bucket: 'Safety', balance: 250000 },
  { name: 'Zerodha Equity', type: 'DMAT', bucket: 'Growth', balance: 400000 },
  { name: 'ICICI FD', type: 'Bank', bucket: 'Safety', balance: 150000 },
];

function AccountsPage() {
  return (
    <div className="page">
      <h2 className="page-title">Accounts</h2>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Bucket</th>
              <th className="text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {mockAccounts.map((acc, index) => (
              <tr key={index}>
                <td>{acc.name}</td>
                <td>{acc.type}</td>
                <td>{acc.bucket}</td>
                <td className="text-right">
                  {acc.balance.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountsPage;
