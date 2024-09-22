import { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  Avatar,
  Box,
  IconButton,
  Button
} from "@mui/material";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  LastPage,
  FirstPage,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  ModeEditOutlineOutlined,
  AddOutlined
} from "@mui/icons-material";
import UserDialog from "../components/UserDialog";
import FilePreview from "../components/FilePreview";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

interface Props {
  handleLogout: () => void
}

function UsersDashboard(props: Props) {
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    per_page: 0,
    total: 0,
    total_pages: 0,
  });
  const [open,setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    job: '',
    id: 0,
  })
  const [type, setType] = useState<'add' | 'edit' | null>(null)
  const apiURL = import.meta.env.VITE_API_URL;

  const getAllUsers = async (page: number) => {
    try {
      const response = await axios.get(
        `${apiURL}/users/?page=${page}`
      );
      setUsers(response.data.data);
      setPageInfo({
        ...pageInfo,
        currentPage: page,
        per_page: response.data.per_page,
        total: response.data.total,
        total_pages: response.data.total_pages,
      });
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
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageInfo({ ...pageInfo, currentPage: newPage });
    if(pageInfo.currentPage !== newPage){
      getAllUsers(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageInfo({
      ...pageInfo,
      per_page: parseInt(event.target.value, 10),
      currentPage: 0,
    });
  };

  useEffect(() => {
    getAllUsers(pageInfo.currentPage);
  }, []);

  const getUserDataBasedOnID =  async (id: number) => {
    try {
       const response = await axios.get(`${apiURL}/users/${id}`)
       const name = response.data.data.first_name + ' ' +  response.data.data.last_name
       setSelectedUser({ ...selectedUser, name: name, id: id })
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
  }

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: 'add' | 'edit', id?: number) => {
      setOpen(true)
      setType(type)
      if(type === 'edit' && id !== undefined){
        getUserDataBasedOnID(id)
      }
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setSelectedUser({ name: '', job: '', id: 0 })
  }

  return (
    <Layout handleLogout={props.handleLogout}>
      <Fragment>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h4>LIST OF USERS</h4>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={(e) => handleOpen(e, 'add')}>
            Add User
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <Avatar alt="username" src={user.avatar} />
                    <span>{user.first_name + ' ' + user.last_name}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleOpen(e, 'edit', user.id)}>
                      <ModeEditOutlineOutlined />
                    </IconButton>
                    <IconButton>
                      <FilePreview />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[6]}
                  colSpan={3}
                  count={pageInfo.total}
                  rowsPerPage={pageInfo.per_page}
                  page={pageInfo.currentPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <UserDialog open={open} handleClose={handleCloseDialog} type={type} user={selectedUser}  setSelectedUser={setSelectedUser} />
      </Fragment>
    </Layout>
  );
}
export default UsersDashboard;
