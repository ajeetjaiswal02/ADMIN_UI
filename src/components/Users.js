import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';  
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const columns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'Name', headerName: 'Name', width: 130 },
    { field: 'Email', headerName: 'Email', width: 130 },
    { field: 'Role', headerName: 'Role', width: 130 },
    { field: 'Action', headerName: 'Action', width: 130 }
  ];

const Users = () => {

    const [users,setUsers] = useState([]);
    const [search,setSearch] = useState('');

    const getUsers = async () => {
        try {
            const data = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
            console.log(data.data)
            setUsers(data.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getUsers()
    }, [])

    const Delete = (id) => {
        console.log(id)
    }

    const mapUsers = () => {
        return users.filter(item => {
            if (search === "") {
                return item
            }
            else if (item.name.toLowerCase().includes(search.toLowerCase())) {
                return item
            }
        }).
        map((user) => {
            return {
                id: user.id,
                Name: user.name,
                Email: user.email,
                Role: user.role,
                Action: <EditOutlinedIcon onClick={() => Delete(user.id)} />
            }
        })
    }

    
    const rows = mapUsers();
        
    return (
        <div className = "App" >
            <input
              type="text"
              placeholder="Search"
              onChange  = {(e) => setSearch(e.target.value)} 
            />
            <DataGrid style={{ height: 400, width: `100%`, paddingLeft: `200px`, paddingTop: `30px`}}
              rows= {rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />

        </div>
    );
}
export default Users;
