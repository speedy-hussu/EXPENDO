import React, { useEffect, useState } from "react";
import "./ExpenseList.css";
import { FaRupeeSign } from "react-icons/fa";
import { Container, Popup } from "../../components/componentIndex";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dbService from "../../appwrite/database";
import { expenseGroups } from "../../redux/groupSlice";
function ExpenseList() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const groups = useSelector((state) => state.expenseGroups.groups);
  const [expenses, setExpenses] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const rawDate = dateStr.split("T")[0]; // Extract "yyyy-mm-dd"
    const [year, month, day] = rawDate.split("-");
    return `${day}-${month}-${year}`;
  }
  ;
  async function deleteGroup() {
    if (confirm("want to delete", groupName)) {
      await dbService.deleteGroupAndExpenses(groupId);
      setShowPopup(true);
      setPopup("Group Deleted");
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      const updatedGroups = groups.filter((g) => g.$id !== groupId);
      dispatch(expenseGroups(updatedGroups));
      navigate("/group");
    }
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
      setShowPopup(true);
      setPopup("Expense Added");
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    const total = expenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0
    );
    setTotalExpense(total);
  }, [expenses]);

  async function fetchExpenses() {
    try {
      const data = await dbService.getExpenses(groupId);
      if (data) {
        const sortedExpenses = [...data.documents] // clone first
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // ISO works natively

        setExpenses(sortedExpenses); // triggers re‑render in correct order
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function dltExpense(expenseId) {
    try {
      await dbService.deleteExpense(expenseId);

      setShowPopup(true);
      setPopup("Expense Deleted");

      fetchExpenses();
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  }
  async function updExpense(expenseId) {
    try {
      await dbService.updateExpense(
        expenseId,
        data.title,
        parseInt(data.amount),
        data.date
      );
      
      setEditId(null);
      fetchExpenses();
      setShowPopup(true);
      setPopup("Expense Edited");
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    const group = groups?.find((g) => g.$id === groupId);
    if (group) {
      setGroupName(group.groupName);
    } else {
      // fallback if groups not in redux (e.g., on page reload)
      async function fetchGroup() {
        const res = await dbService.getGroup(groupId); // create this function
        if (res) setGroupName(res.groupName);
      }
      fetchGroup();
    }
  }, [groups, groupId]);

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);
  return (
    <Container>
      {showPopup && <Popup message={popup} />}
      <div className="expense-list-page">
        <div className="expense-left">
          <div className="expense-info">
            <div className="expense-group-name">{groupName}</div>
            <div className="bottom">
              <button onClick={deleteGroup} className="dlt-group-btn">
                Delete group
              </button>
              <p className="expense-total">
                Total : <FaRupeeSign /> {totalExpense || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="expense-right">
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
            <button
              onClick={addExpense}
              className="add-expense-btn"
              disabled={editId}
            >
              Add
            </button>
          </div>

          <div className="expense-container">
            <div className="expense-table">
              {expenses &&
                expenses.map((expense) => (
                  <div className="expense-row" key={expense.$id}>
                    <div className="name">{expense.title}</div>
                    <div className="amount td">
                      <FaRupeeSign /> {expense.amount}
                    </div>
                    <div className="date">{formatDate(expense.date)}</div>
                    <div className="action">
                      {editId === expense.$id ? (
                        <button
                          onClick={() => updExpense(expense.$id)}
                          className="edit-btn"
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const formattedDate = new Date(expense.date)
                              .toISOString()
                              .split("T")[0];
                            setData({
                              title: expense.title,
                              amount: expense.amount,
                              date: formattedDate,
                            });
                            setEditId(expense.$id);
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (confirm(`want to delete",${expense.title}`)) {
                            dltExpense(expense.$id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ExpenseList;
