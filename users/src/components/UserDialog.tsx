import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import { toast } from "react-toastify";

interface Props {
   open: boolean;
   type: 'add' | 'edit' | null,
   user: {
    name: string;
    job: string
    id: number
   }
   setSelectedUser: React.Dispatch<React.SetStateAction<{
    name: string;
    job: string;
    id: number
}>>
   handleClose: () => void
}
export default function UserDialog(props: Props) {

const { open, type, user, handleClose, setSelectedUser } = props 

const addNewUser = async() => {
  try {
    await axios.post('https://reqres.in/api/users', user)
    toast.success('User added successfully', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    handleClose()
  } catch (error: any) {
     toast.error(error, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
  }
  finally{
     setSelectedUser({ name: '', job: '', id: 0 })
  }
}

const editUser = async() => {
    try {
      await axios.put(`https://reqres.in/api/users/${user.id}`, user)
      toast.success('User updated successfully', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      handleClose()
    } catch (error: any) {
       toast.error(error, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
    }
    finally{
       setSelectedUser({ name: '', job: '' , id: 0 })
    }
  }

const handleSubmit = (e: any) => {
  e.preventDefault()
  if(type === 'add') {
    addNewUser()
  }
  else if (type === 'edit') {
    editUser()
  }
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser({ ...user, [name]: value });
};


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit ,
        }}
      >
        <DialogTitle><b>{type?.toUpperCase()} USER</b></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide detailed information when {type}ing a user to ensure accurate and up-to-date records, including personal details, roles, and permissions.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={user?.name}
            onChange={handleChange}
          />
           <TextField
            autoFocus
            required
            margin="dense"
            id="job"
            name="job"
            label="Job"
            type="text"
            fullWidth
            variant="standard"
            value={user?.job}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{ type === 'add' ? 'ADD' : 'UPDATE'}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
