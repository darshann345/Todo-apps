import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    IconButton,
    Paper,
    Collapse,
    useMediaQuery,
    useTheme,
    Stack,
    Checkbox,
    TextField,
    Chip,
    Menu,
    MenuItem,
    Modal,
    Select,
    FormControl,
    InputLabel,
    TextareaAutosize
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import TaskTabs from './TaskTabs';
import SearchInput from './SearchInput';
import Icon from "./../assets/Icon.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from './../assets/XMLID_6_.svg';
import FileDropArea from './FileDropArea';
import ResultNotFound from "./../assets/Results not found.png";

// Task type definition
interface Task {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
    category: 'Work' | 'Personal' | 'Other';
    completed: boolean;
}

function TaskBuddy() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            name: 'Interview with Design Team',
            description: '',
            dueDate: '18 Dec, 2024',
            status: 'TO-DO',
            category: 'Work',
            completed: false
        },
        {
            id: '2',
            name: 'Team Meeting',
            description: '',
            dueDate: '30 Dec, 2024',
            status: 'TO-DO',
            category: 'Personal',
            completed: false
        },
        {
            id: '3',
            name: 'Design a Dashboard page along with wireframes',
            description: '',
            dueDate: '31 Dec, 2024',
            status: 'TO-DO',
            category: 'Work',
            completed: false
        },
        {
            id: '4',
            name: 'Morning Workout',
            description: '',
            dueDate: '18 Dec, 2024',
            status: 'IN-PROGRESS',
            category: 'Work',
            completed: false
        },
        {
            id: '5',
            name: 'Code Review',
            description: '',
            dueDate: '18 Dec, 2024',
            status: 'IN-PROGRESS',
            category: 'Personal',
            completed: false
        },
        {
            id: '6',
            name: 'Update Task Tracker',
            description: '',
            dueDate: '25 Dec, 2024',
            status: 'IN-PROGRESS',
            category: 'Work',
            completed: false
        },
        // Completed tasks
        {
            id: '7',
            name: 'Submit Project Proposal',
            description: '',
            dueDate: '18 Dec, 2024',
            status: 'COMPLETED',
            category: 'Work',
            completed: true
        },
        {
            id: '8',
            name: 'Birthday Gift Shopping',
            description: '',
            dueDate: '18 Dec, 2024',
            status: 'COMPLETED',
            category: 'Personal',
            completed: true
        },
        {
            id: '9',
            name: 'Client Presentation',
            description: '',
            dueDate: '25 Dec, 2024',
            status: 'COMPLETED',
            category: 'Work',
            completed: true
        }
    ]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "500px",
        height: "700px",
        border: '2px solid #000',
        borderRadius: '8px',
        backgroundColor: "white",
        p: 4,
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [todoCollapsed, setTodoCollapsed] = useState(false);
    const [inProgressCollapsed, setInProgressCollapsed] = useState(false);
    const [completedCollapsed, setCompletedCollapsed] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState('All');
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [openAccordion, setOpenAccorion] = useState('');

    const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<'Work' | 'Personal'>('Work');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState<'TO-DO' | 'IN-PROGRESS' | 'COMPLETED'>('TO-DO');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // Track the task being edited

    const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTaskForOptions, setSelectedTaskForOptions] = useState<string | null>(null);

    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);


    const [taskList, setTaskList] = useState({ "todo": [], "in_progress": [], "completed": [] });

    const [currentView, setCurrentView] = useState<'list' | 'board'>('list');


    useEffect(() => {
        filterTasks();
    }, [categoryFilter]);
    
    const filterTasks = (data = tasks) => {
        let filteredTasks = data;
    
        if (categoryFilter !== 'All') {
            filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
        }
        
    
        setTaskList({
            todo: filteredTasks.filter(task => task.status === 'TO-DO'),
            in_progress: filteredTasks.filter(task => task.status === 'IN-PROGRESS'),
            completed: filteredTasks.filter(task => task.status === 'COMPLETED')
        });
    };


    const handleOpenCreateTaskModal = (taskId?: string) => {
        if (taskId) {
            const taskToEdit = tasks.find(task => task.id === taskId);

            if (taskToEdit) {
                setNewTaskTitle(taskToEdit.name);
                setNewTaskDescription(taskToEdit.description);
                setNewTaskCategory(taskToEdit.category);
                setNewTaskDueDate(taskToEdit.dueDate);
                setNewTaskStatus(taskToEdit.status);
                setEditingTaskId(taskId);
            }
        } else {
            resetNewTaskFields();
            setEditingTaskId(null);
        }
        setOpenCreateTaskModal(true);
    };

    const handleCloseCreateTaskModal = () => {
        setOpenCreateTaskModal(false);
        resetNewTaskFields();
    };

    const resetNewTaskFields = () => {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskCategory('Work');
        setNewTaskDueDate('');
        setNewTaskStatus('TO-DO');
    };

    const handleCreateTask = () => {
        if (newTaskTitle.trim()) {
            if (editingTaskId) {
                const updatedTasks = tasks.map(task =>
                    task.id === editingTaskId
                        ? { ...task, name: newTaskTitle, description: newTaskDescription, dueDate: newTaskDueDate, status: newTaskStatus, category: newTaskCategory }
                        : task
                );
                setTasks(updatedTasks);
                filterTasks(updatedTasks);
            } else {
                const newTask: Task = {
                    id: Date.now().toString(),
                    name: newTaskTitle,
                    description: newTaskDescription,
                    dueDate: newTaskDueDate,
                    status: newTaskStatus,
                    category: newTaskCategory,
                    completed: false
                };
                const updatedTasks = [...tasks, newTask];
                setTasks(updatedTasks);
                filterTasks(updatedTasks);
            }
            handleCloseCreateTaskModal();
        }
    };
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        filterTasks(tasks.filter(item => item.name.toLowerCase().includes(term.toLowerCase())));
    };

    const handleTaskCheckboxChange = (taskId: string) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    const handleEditTask = (taskId: string) => {
        handleOpenCreateTaskModal(taskId);
        setOptionsAnchorEl(null)
    };

    const handleDeleteTask = (taskId, event) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        setTasks(updatedTasks);
        setOptionsAnchorEl(null)
        filterTasks(updatedTasks);


    };
    const handleStatusClick = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
        console.log("Clicked Task ID:", taskId); 
        setSelectedTaskId(taskId);
        setStatusAnchorEl(event.currentTarget); 
        
    };

    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
        setSelectedTaskId(null);
    };

    const handleOptionsClick = (event: React.MouseEvent<HTMLElement>, taskid: string) => {

        setOptionsAnchorEl(event.currentTarget);
        setSelectedTaskForOptions(taskid)

    };

    const handleOptionsMenuClose = () => {
        setOptionsAnchorEl(null);
        setSelectedTaskForOptions(null);
    };

    const handleBulkStatusChange = (newStatus: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') => {
        const updatedTasks = tasks.map(task => {
            if (selectedTasks.includes(task.id)) {
                return { ...task, status: newStatus, completed: newStatus === 'COMPLETED' };
            }
            console.log(newStatus)
            return task;
        });
        
        setTasks(updatedTasks);
        console.log(updatedTasks)
        setSelectedTasks([]); // Clear selection after updating
        handleStatusMenuClose(); // Close the status menu
    };
    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const renderStatusChip = (status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED', taskId: string) => {
    //     let color = '';
    //     switch (status) {
    //         case 'TO-DO':
    //             color = '#f0f0f0';
    //             break;
    //         case 'IN-PROGRESS':
    //             color = '#e6f7ff';
    //             break;
    //         case 'COMPLETED':
    //             color = '#f0f0f0';
    //             break;
    //     }
    //     return (
    //         <Box
    //             sx={{
    //                 bgcolor: color,
    //                 px: 1,
    //                 py: 0.5,
    //                 borderRadius: '4px',
    //                 fontSize: '0.75rem',
    //                 display: 'inline-flex',
    //                 alignItems: 'center',
    //                 cursor: 'pointer',
    //                 '&:hover': {
    //                     bgcolor: theme.palette.action.hover
    //                 }
    //             }}
    //             onClick={(e) => handleStatusClick(e, taskId)} // Ensure this is correct
    //         >
    //             {status}
    //             <ArrowDropDownIcon fontSize="small" />
    //         </Box>
    //     );
    // };
    const renderStatusChip = (status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED', taskId: string) => {
        let color = '';
        switch (status) {
            case 'TO-DO':
                color = '#f0f0f0';
                break;
            case 'IN-PROGRESS':
                color = '#f0f0f0';
                break;
            case 'COMPLETED':
                color = '#f0f0f0'; // Change color for completed tasks
                break;
        }
        return (
            <Box
                sx={{
                    bgcolor: color,
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: theme.palette.action.hover
                    }
                }}
                onClick={(e) => handleStatusClick(e, taskId)} // Ensure this is correct
            >
                {status}
                <ArrowDropDownIcon fontSize="small" />
            </Box>
        );
    };
    function handleFooterStatusUpdateClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
    }
    const filterCategories = categoryFilter === 'all' ? tasks : tasks.filter(task => task.category === categoryFilter);
    return (
        <Box sx={{
            padding: { xs: '10px', sm: '15px', md: '20px' },
            maxWidth: '100%',
            margin: '0 auto',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                mb={2}
                width="100%"
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={Icon} alt="TaskbuddyIcon" width="24px" />
                    <Typography sx={{ fontWeight: 'bold' }}>
                        TaskBuddy
                    </Typography>
                </Box>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                        <Avatar alt="Aravind" sx={{ width: 30, height: 30, marginTop: '5px' }}></Avatar>
                        <h2>Darshan N</h2>
                    </Box>
                </Stack>
            </Stack>

            <TaskTabs currentView={currentView} onChangeView={setCurrentView} />

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end", marginTop: "-50px" }}>
                <button
                    style={{
                        border: '1px solid pink',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                    }}
                    onClick={handleLogout}
                >
                    <img
                        src={LogoutIcon}
                        alt="Logout Icon"
                        style={{
                            height: '20px',
                            width: '20px',
                            marginRight: '8px',
                        }}
                    />
                    Logout
                </button>
            </Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                my={1}
                width="100%"
                marginTop="40px"
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Filter by:</Typography>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | 'Work' | 'Personal')}
                            label="Category"
                            endAdornment={
                                <span className="material-icons" style={{ fontSize: '1rem' }}>
                                </span>
                            }
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Work">Work</MenuItem>
                            <MenuItem value="Personal">Personal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
        <TextField
            label="Due Date"
            type="date"
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
        />
    </FormControl>


                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Box sx={{ width: '200px' }}>
                        <SearchInput onSearch={handleSearch} />
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'purple',
                            color: 'white',
                            borderRadius: '20px',
                            '&:hover': {
                                bgcolor: '#6a0dad',
                            },
                            fontSize: '0.8rem',
                            py: 0.5,
                            px: 2
                        }}
                        onClick={() => handleOpenCreateTaskModal()} // Open modal for creating a new task
                    >
                        ADD TASK
                    </Button>
                    <Modal
                        sx={style}
                        open={openCreateTaskModal}
                        onClose={handleCloseCreateTaskModal}
                        aria-labelledby="create-task-modal-title"
                        aria-describedby="create-task-modal-description"
                        BackdropProps={{
                            style: { backgroundColor: 'rgba(255, 255, 255, 0.5)' }, // Light backdrop
                        }}
                    >
                        <Box>
                            <Typography id="create-task-modal-title" variant="h6" component="h2">
                                {editingTaskId ? 'Edit Task' : 'Create Task'} {/* Change title based on mode */}
                            </Typography>
                            <TextField
                                label="Task Title"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextareaAutosize
                                minRows={3}
                                placeholder="Description"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                style={{ width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Task Category</InputLabel>
                                <Select
                                    value={newTaskCategory}
                                    onChange={(e) => setNewTaskCategory(e.target.value as 'Work' | 'Personal')}
                                >
                                    <MenuItem value="Work">Work</MenuItem>
                                    <MenuItem value="Personal">Personal</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Due Date"
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Task Status</InputLabel>
                                <Select
                                    value={newTaskStatus}
                                    onChange={(e) => setNewTaskStatus(e.target.value as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED')}
                                >
                                    <MenuItem value="TO-DO">TO-DO</MenuItem>
                                    <MenuItem value="IN-PROGRESS">IN-PROGRESS</MenuItem>
                                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ border: '1px dashed #ccc', padding: '16px', textAlign: 'center', mb: 2 }}>
                                <FileDropArea />
                            </Box>
                            <Stack direction="row" justifyContent="flex-end">
                                <Button onClick={handleCloseCreateTaskModal} variant="outlined" sx={{ mr: 1 }}>
                                    CANCEL
                                </Button>
                                <Button onClick={handleCreateTask} variant="contained">
                                    {editingTaskId ? 'UPDATE' : 'CREATE'} {/* Change button text based on mode */}
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>
                </Stack>
            </Stack>

            {/* Task Headers */}

            {
                currentView === "list" ? (
                    <>
                        <Box sx={{
                            display: 'flex',
                            mb: 1,
                            px: 2,
                            width: '96vw',
                            borderBottom: '1px solid #f0f0f0',
                            py: 1
                        }}>
                            <Typography sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.8rem' }}>Task name</Typography>
                            <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>Due on</Typography>
                            <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>Task Status</Typography>
                            <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>Task Category</Typography>
                            <Box sx={{ width: 40 }}></Box>
                        </Box>
                        <Box sx={{ flex: 1, overflow: 'auto' }}>



                            { taskList?.todo?.length > 0 && <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '100%', boxShadow: 'none' }}>

                                <Box
                                    sx={{
                                        bgcolor: '#ffccf9',
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setTodoCollapsed(!todoCollapsed)}
                                >

                                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Todo ({taskList?.todo?.length})</Typography>
                                    <IconButton size="small">
                                        {todoCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                    </IconButton>
                                </Box>
                                <Collapse in={!todoCollapsed}>
                                    {taskList?.todo?.map(task => (
                                        <Box key={task.id} sx={{
                                            p: 1,
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Box>

                                            </Box>
                                            <Checkbox
                                                checked={selectedTasks.includes(task.id)}
                                                onChange={() => handleTaskCheckboxChange(task.id)}
                                                size="small"
                                            />
                                            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>

                                                <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                <Box sx={{ flex: 1 }}>{renderStatusChip(task.status, task.id)}</Box>
                                                <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>
                                                {

                                                }
                                                <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                    <IconButton
                                                        size="small"
                                                        aria-label="more options"
                                                        onClick={(e) => handleOptionsClick(e, task.id)}
                                                    >
                                                        <MoreHorizIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                            </Box>

                                        </Box>

                                    ))}
                                    {taskList?.todo?.length === 0 && (
                                        <Box sx={{
                                            height: '100px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            bgcolor: '#fff'
                                        }}>
                                            <Typography color="text.secondary" fontSize="0.9rem">No Tasks in To-Do</Typography>
                                        </Box>
                                    )}
                                </Collapse>
                                <br />
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'purple',
                                        color: 'white',
                                        borderRadius: '20px',
                                        '&:hover': {
                                            bgcolor: '#6a0dad',
                                        },
                                        fontSize: '0.8rem',
                                        py: 0.5,
                                        px: 2
                                    }}
                                    onClick={() => handleOpenCreateTaskModal()} // Open modal for creating a new task
                                >
                                    + ADD TASK
                                </Button>

                            </Paper>
                            }

                            {/* In-Progress Section */}
                            {taskList?.in_progress?.length > 0 && <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '100%', boxShadow: 'none' }}>
                                <Box
                                    sx={{
                                        bgcolor: '#a8e6ff',
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setInProgressCollapsed(!inProgressCollapsed)}
                                >
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>In-Progress ({taskList?.in_progress?.length})</Typography>
                                    <IconButton size="small">
                                        {inProgressCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                    </IconButton>
                                </Box>
                                <Collapse in={!inProgressCollapsed}>
                                    {taskList?.in_progress?.map(task => (
                                        <Box key={task.id} sx={{
                                            p: 1,
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Checkbox
                                                checked={selectedTasks.includes(task.id)}
                                                onChange={() => handleTaskCheckboxChange(task.id)}
                                                size="small"
                                            />
                                            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                                <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                <Box sx={{ flex: 1 }}>{renderStatusChip(task.status, task.id)}</Box>
                                                <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>
                                                <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                    <IconButton
                                                        size="small"
                                                        aria-label="more options"
                                                        onClick={(e) => handleOptionsClick(e, task.id)}
                                                    >
                                                        <MoreHorizIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                    {taskList?.in_progress?.length === 0 && (
                                        <Box sx={{
                                            height: '100px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            bgcolor: '#fff'
                                        }}>
                                            <Typography color="text.secondary" fontSize="0.9rem">No Tasks In Progress</Typography>
                                        </Box>
                                    )}
                                </Collapse>
                            </Paper>
                            }

                            {/* Completed Section */}
                            {taskList?.completed?.length > 0 &&
                                <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '100%', boxShadow: 'none' }}>
                                    <Box
                                        sx={{
                                            bgcolor: '#b3ffb3',
                                            p: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCompletedCollapsed(!completedCollapsed)}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Completed ({taskList?.completed?.length})</Typography>
                                        <IconButton size="small">
                                            {completedCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                    <Collapse in={!completedCollapsed}>
                                        {taskList?.completed?.map(task => (
                                            <Box key={task.id} sx={{
                                                p: 1,
                                                borderBottom: '1px solid #f0f0f0',
                                                bgcolor: '#fff',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <Checkbox
                                                    checked={selectedTasks.includes(task.id)}
                                                    onChange={() => handleTaskCheckboxChange(task.id)}
                                                    size="small"
                                                    color="success"
                                                />
                                                <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                                    <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                    <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                    <Box sx={{ flex: 1 }}>{renderStatusChip(task.status, task.id)}</Box>
                                                    <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>
                                                    <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                        <IconButton
                                                            size="small"
                                                            aria-label="more options"
                                                            onClick={(e) => handleOptionsClick(e, task.id)}
                                                        >
                                                            <MoreHorizIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                        {taskList?.completed.length === 0 && (
                                            <Box sx={{
                                                height: '100px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                bgcolor: '#fff'
                                            }}>
                                                <Typography color="text.secondary" fontSize="0.9rem">No Tasks Completed </Typography>
                                            </Box>
                                        )}
                                    </Collapse>

                                </Paper>
                            }
                            {taskList?.todo.length === 0 && taskList?.in_progress.length === 0 && taskList?.completed.length === 0 && (
                                <Box sx={{
                                    height: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: '#fff'
                                }}>
                                    <img style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "400px", height: "300px", width: "600px" }}
                                        src={ResultNotFound} alt="Result Not Found" />
                                </Box>
                            )}
                        </Box>


                    </>
                ) : (
                    <>

                        <Box sx={{ flex: 1, overflow: 'auto', width: "98vw", flexDirection: "row" }}>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: "90px" }}>
                                {taskList?.todo?.length > 0 && <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '30%', boxShadow: 'none' }}>
                                    <Box
                                        sx={{
                                            bgcolor: '#ffccf9',
                                            p: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setTodoCollapsed(!todoCollapsed)}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Todo ({taskList?.todo?.length})</Typography>
                                        <IconButton size="small">
                                            {todoCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                    <Collapse in={!todoCollapsed}>

                                        {taskList?.todo?.map(task => (
                                            <Box key={task.id} sx={{
                                                p: 1,
                                                borderBottom: '1px solid #f0f0f0',
                                                bgcolor: '#fff',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                                                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: "space-between", gap: "350px" }}>
                                                        <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                        <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                aria-label="more options"
                                                                onClick={(e) => handleOptionsClick(e, task.id)}
                                                            >
                                                                <MoreHorizIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', gap: "350px" }}>
                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>

                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                    </Box>
                                                </Box>

                                            </Box>
                                        ))}
                                        {taskList?.todo.length === 0 && (
                                            <Box sx={{
                                                height: '100px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                bgcolor: '#fff'
                                            }}>
                                                <Typography color="text.secondary" fontSize="0.9rem">No Tasks in To-Do</Typography>
                                            </Box>
                                        )}
                                    </Collapse>
                                    <br />


                                </Paper>
                                }

                                {/* In-Progress Section */}
                                {taskList?.in_progress.length > 0 && <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '30%', boxShadow: 'none' }}>
                                    <Box
                                        sx={{
                                            bgcolor: '#a8e6ff',
                                            p: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setInProgressCollapsed(!inProgressCollapsed)}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>In-Progress ({taskList?.in_progress.length})</Typography>
                                        <IconButton size="small">
                                            {inProgressCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                    <Collapse in={!inProgressCollapsed}>
                                        {taskList?.in_progress.map(task => (
                                            <Box key={task.id} sx={{
                                                p: 1,
                                                borderBottom: '1px solid #f0f0f0',
                                                bgcolor: '#fff',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                                                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: "space-between", gap: "390px" }}>
                                                        <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                        <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                aria-label="more options"
                                                                onClick={(e) => handleOptionsClick(e, task.id)}
                                                            >
                                                                <MoreHorizIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', gap: "360px" }}>
                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>

                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                    </Box>
                                                </Box>


                                            </Box>
                                        ))}
                                        {taskList?.in_progress.length === 0 && (
                                            <Box sx={{
                                                height: '100px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                bgcolor: '#fff'
                                            }}>
                                                <Typography color="text.secondary" fontSize="0.9rem">No Tasks In Progress</Typography>
                                            </Box>
                                        )}
                                    </Collapse>
                                </Paper>}

                                {/* Completed Section */}
                                {taskList?.completed.length > 0 && <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: '8px', width: '30%', boxShadow: 'none' }}>
                                    <Box
                                        sx={{
                                            bgcolor: '#b3ffb3',
                                            p: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCompletedCollapsed(!completedCollapsed)}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Completed ({taskList?.completed.length})</Typography>
                                        <IconButton size="small">
                                            {completedCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                    <Collapse in={!completedCollapsed}>
                                        {taskList?.completed?.map(task => (
                                            <Box key={task.id} sx={{
                                                p: 1,
                                                borderBottom: '1px solid #f0f0f0',
                                                bgcolor: '#fff',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                                                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: "space-between", gap: "360px" }}>
                                                        <Typography sx={{ flex: 2, fontSize: '0.9rem' }}>{task.name}</Typography>
                                                        <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                aria-label="more options"
                                                                onClick={(e) => handleOptionsClick(e, task.id)}
                                                            >
                                                                <MoreHorizIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', gap: "360px" }}>
                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.category}</Typography>
                                                        <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{task.dueDate}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                        {taskList?.completed.length === 0 && (
                                            <Box sx={{
                                                height: '100px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                bgcolor: '#fff'
                                            }}>
                                                <img scr="" alt="" />
                                            </Box>
                                        )}
                                    </Collapse>
                                </Paper>}
                            </Box>
                            {taskList?.todo.length === 0 && taskList?.in_progress.length === 0 && taskList?.completed.length === 0(
                                <Box sx={{
                                    height: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: '#fff'
                                }}>
                                    <img style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "400px", height: "300px", width: "600px" }}
                                        src={ResultNotFound} alt="Result Not Found" />
                                </Box>
                            )}
                        </Box>


                    </>

                )}



            {/* Status Dropdown Menu */}
            <Menu
                anchorEl={statusAnchorEl}
                open={Boolean(statusAnchorEl)}
                onClose={handleStatusMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={() => handleBulkStatusChange('TO-DO')}>
                    <Box sx={{
                        bgcolor: '#f0f0f0',
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        TO-DO
                    </Box>
                </MenuItem>
                <MenuItem onClick={() => handleBulkStatusChange('IN-PROGRESS')}>
                    <Box sx={{
                        bgcolor: '#e6f7ff',
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        IN-PROGRESS
                    </Box>
                </MenuItem>
                <MenuItem onClick={() => handleBulkStatusChange('COMPLETED')}>
                    <Box sx={{
                        bgcolor: '#f0f0f0',
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        COMPLETED
                    </Box>
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={optionsAnchorEl}
                open={Boolean(optionsAnchorEl)}
                onClose={handleOptionsMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: '120px',
                        borderRadius: '4px',
                        '& .MuiMenuItem-root': {
                            fontSize: '0.85rem',
                            py: 0.75
                        }
                    }
                }}
            >
                <MenuItem onClick={() => selectedTaskForOptions && handleEditTask(selectedTaskForOptions)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                        <Typography sx={{ fontSize: '0.85rem' }}>Edit</Typography>
                    </Box>
                </MenuItem>
                <MenuItem onClick={() => selectedTaskForOptions && handleDeleteTask(selectedTaskForOptions)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                        <Typography sx={{ fontSize: '0.85rem' }}>Delete</Typography>
                    </Box>
                </MenuItem>
            </Menu>

            {/* Footer for Selected Tasks */}
            {selectedTasks.length > 0 && (
                <Box sx={{
                    bgcolor: 'black',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: "1000px",
                    marginLeft: "600px",
                    alignItems: 'center'
                }}>
                    <Typography>
                        {selectedTasks.length} Task{selectedTasks.length !== 1 ? 's' : ''} Selected
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ flex: 1, border: "1px solid white" }}>Update Status{renderStatusChip(selectedTasks.status, selectedTasks.id)}</Box>

                        <Button
                            variant="outlined"
                            sx={{ color: 'white', borderColor: 'white' }}
                            onClick={() => {
                                selectedTasks.forEach(taskId => handleDeleteTask(taskId));
                                setSelectedTasks([]); // Clear selection after deletion
                            }}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}

export default TaskBuddy;
