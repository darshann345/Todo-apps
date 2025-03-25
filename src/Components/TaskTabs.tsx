import { Tabs, Tab, Box } from '@mui/material';

interface TaskTabsProps {
    currentView: 'list' | 'board';
    onChangeView: (view: 'list' | 'board') => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ currentView, onChangeView }) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={currentView} onChange={(event, newValue) => onChangeView(newValue)}>
                <Tab label="List" value="list" />
                <Tab label="Board" value="board" />
            </Tabs>
        </Box>
    );
};

export default TaskTabs;