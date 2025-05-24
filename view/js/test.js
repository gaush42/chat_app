const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token"); // Must be set at login

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

function display(res) {
  document.getElementById("output").innerText = JSON.stringify(res.data, null, 2);
}

async function createGroup() {
  const name = document.getElementById("groupName").value;
  const res = await axiosInstance.post("/create", { name });
  display(res);
}

async function addMember() {
  const groupId = document.getElementById("addGroupId").value;
  const userId = document.getElementById("addUserId").value;
  const res = await axiosInstance.post("/add-member", { groupId, userId });
  display(res);
}

async function removeMember() {
  const groupId = document.getElementById("removeGroupId").value;
  const userId = document.getElementById("removeUserId").value;
  const res = await axiosInstance.post("/remove-member", { groupId, userId });
  display(res);
}

async function makeAdmin() {
  const groupId = document.getElementById("adminGroupId").value;
  const userId = document.getElementById("adminUserId").value;
  const res = await axiosInstance.post("/make-admin", { groupId, userId });
  display(res);
}

async function joinGroup() {
  const groupId = document.getElementById("joinGroupId").value;
  const res = await axiosInstance.post("/join", { groupId });
  display(res);
}

async function getGroupInfo() {
  const groupId = document.getElementById("infoGroupId").value;
  const res = await axiosInstance.get(`/${groupId}/info`);
  display(res);
}

async function getMyGroups() {
  const res = await axiosInstance.get("/my-groups");
  display(res);
}

async function getMessages() {
  const groupId = document.getElementById("messageGroupId").value;
  const res = await axiosInstance.get(`/${groupId}/messages`);
  display(res);
}

async function sendMessage() {
  const groupId = document.getElementById("sendGroupId").value;
  const content = document.getElementById("messageContent").value;
  const res = await axiosInstance.post(`/${groupId}/send`, { content });
  display(res);
}
