import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import dbService from "../../appwrite/database";
import { Container } from "../../components/componentIndex";
import { useDispatch, useSelector } from "react-redux";
import "./GroupList.css";
import { useNavigate } from "react-router-dom";
import { expenseGroups } from "../../redux/groupSlice";
function GroupList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groups = useSelector((state) => state.expenseGroups.groups);
  const user = useSelector((state) => state.auth.userData);
  useEffect(() => {
    async function fetchGroups() {
      if (user?.$id && groups.length === 0) {
        const data = await dbService.getGroups(user.$id);
        if (data) dispatch(expenseGroups(data.documents));
      }
    }
    fetchGroups();
  }, [user, groups]);

  async function createGroup() {
    const name = prompt("Enter your Expense Group Name");

    if (!name) {
      alert("Group name cannot be empty!");
      return;
    }

    try {
      const newGroup = await dbService.createGroup(
        user.$id,
        name.toUpperCase()
      );
      if (newGroup) {
        dispatch(expenseGroups([...groups, newGroup]));
        console.log("Successfully created group:", name);
      } else {
        alert("Failed to create group. Please try again.");
      }
    } catch (e) {
      console.error("Error creating group:", e);
      alert("Something went wrong while creating the group.");
    }
  }

  return (
    <Container>
      <div className="group-list-page">
        {groups &&
          groups.map((group) => {
            return (
              <button
                className="group"
                onClick={() => {
                  navigate(`/group/${group.$id}`);
                }}
                key={group.$id}
              >
                <div className="group-name">{group.groupName}</div>
                <div className="group-total-expense"> Total : 1200$</div>
              </button>
            );
          })}
        <button onClick={createGroup} className="group">
          <MdOutlineAddCircleOutline />
        </button>
      </div>
    </Container>
  );
}
export default GroupList;
