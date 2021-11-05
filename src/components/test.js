{users.filter(item => {
    if (search == "") {
        return item
    }
    else if (item.name.toLowerCase().includes(search.toLowerCase())) {
        return item
    }
}).
map((user,index) => {
    return (
        <p>
            {user.name} - {user.email} - {user.role}
        </p>
    )
})}