import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:4545/api/v1/transactions', {
          params: {
            month: selectedMonth,
            search,
            page,
            perPage
          },
        });
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [selectedMonth, search, page]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
    <>
    <h1 className='text-center fw-bolder'>Transactions Dashboard</h1>
    <div className="container mt-4">
      <div className="row mb-3 p-4 rounded-2 bg-secondary-subtle ">
        <div className="col-md-4 mb-2">
          <label htmlFor="month" className="form-label">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="form-select"
          >
            <option value="">All</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="col-md-8 ">
          <input
            type="text"
            placeholder="Search Transactions here ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
          
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date of Sale</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td>
                  <img
                    className="img-fluid"
                    src={transaction.image}
                    alt={transaction.title}
                    style={{ maxHeight: '100px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default TransactionDashboard;