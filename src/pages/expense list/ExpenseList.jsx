import React, { useEffect, useState } from "react";
import "./ExpenseList.css";
import { Container } from "../../components/componentIndex";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dbService from "../../appwrite/database";
function ExpenseList() {
  const { groupId } = useParams();
  const user = useSelector((state) => state.auth.userData);
  const [expenses, setExpenses] = useState("");
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const rawDate = dateStr.split("T")[0]; // Extract "yyyy-mm-dd"
    const [year, month, day] = rawDate.split("-");
    return `${day}-${month}-${year}`;
  }

  const [data, setData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  async function addExpense() {
    if (!data.amount || !data.title) alert("enter the value");
    try {
      await dbService.addExpenseToGroup(
        groupId,
        user.$id,
        data.title,
        parseInt(data.amount),
        data.date
      );
      setData({
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchExpenses() {
    try {
      const data = await dbService.getExpenses(groupId);
      if (data) {
        setExpenses(data.documents);
      }
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    fetchExpenses();
  }, [groupId]);
  useEffect(() => {
    console.log(expenses);
  }, [expenses]);
  return (
    <Container>
      <div className="expense-list-page">
        <div className="expense-group-name">GOA</div>
        <div className="inputs">
          <input
            value={data.title}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            className="input-title"
            type="text"
            placeholder="Title='goa'?"
          />
          <input
            value={data.amount}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                amount: e.target.value,
              }));
            }}
            className="input-amount"
            type="number"
            placeholder="amount"
          />
          <input
            value={data.date}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                date: e.target.value,
              }));
            }}
            className="input-date"
            type="date"
          />
          <button onClick={addExpense} className="add-expense-btn">
            Add
          </button>
        </div>

        <div className="expense-container">
          <div className="expense-header">
            <div className="name">Title</div>
            <div className="amount">Amount</div>
            <div className="date">Date</div>
            <div className="action">Action</div>
          </div>

          {expenses &&
            expenses.map((expense) => (
              <div className="expense-row" key={expense.$id}>
                <div className="name">{expense.title}</div>
                <div className="amount">{expense.amount}</div>
                <div className="date">{formatDate(expense.date)}</div>
                <div className="action">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
}

export default ExpenseList;
