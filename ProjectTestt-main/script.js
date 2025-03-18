const userList = [
    { name: "John Doe", online: true },
    { name: "Jane Smith", online: false },
    { name: "Bob Johnson", online: true },
    { name: "Alice Brown", online: false },
    { name: "Tom Wilson", online: false }
];

const userListItem = (user) => {
    const li = document.createElement('li');
    const status = user.online ? "online" : "offline";
    li.innerHTML = `<a href="#">${user.name} <span class="status ${status}">${status}</span></a>`;
    return li;
};

const userContainer = document.getElementById('user-list');
userList.forEach(user => {
    userContainer.appendChild(userListItem(user));
});

