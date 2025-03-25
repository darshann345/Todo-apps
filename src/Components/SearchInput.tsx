import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';

function SearchInput({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {searchTerm && (
                            <IconButton onClick={handleClear} edge="end">
                                <ClearIcon />
                            </IconButton>
                        )}
                        <IconButton aria-label="search" edge="end">
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: '20px', // Adjust border radius to match design
                    backgroundColor: '#f0f0f0', // Background color to match design
                },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'transparent', // Remove default border
                    },
                    '&:hover fieldset': {
                        borderColor: 'transparent', // Remove hover border
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Remove focused border
                    },
                },
            }}
        />
    );
}

export default SearchInput;