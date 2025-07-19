import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import dbService from "../../appwrite/database";
import { Container } from "../../components/componentIndex";
import { useSelector } from "react-redux";
import "./GroupList.css";
import { useNavigate } from "react-router-dom";
function GroupList() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
  useEffect(() => {
    async function fetchGroups() {
      if (user?.$id) {
        const data = await dbService.getGroups(user.$id);
        console.log(data.documents);
        if (data) {
          setGroups(data.documents);
        }
      }
    }
    fetchGroups();
  }, [user]);
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
        setGroups((prev) => [...prev, newGroup]);
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
        {groups.map((group) => {
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
