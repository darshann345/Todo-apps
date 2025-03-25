import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FileDropArea = () => {
    const [files, setFiles] = useState([]);

    // Handle file drop
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    // Handle drag over
    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent default behavior to allow drop
    };

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    // Handle file removal
    const handleRemoveFile = (fileToRemove) => {
        setFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
    };

    return (
        <Box
            sx={{
                border: '1px dashed #ccc',
                padding: '16px',
                textAlign: 'center',
                mb: 2,
                cursor: 'pointer',
                backgroundColor: '#f9f9f9', // Optional: Light background for better visibility
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <Typography variant="body1">
                Drop your files here or click to upload
            </Typography>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
            />
            <label htmlFor="file-upload">
                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                    Upload Files
                </Button>
            </label>
            <Box sx={{ mt: 2 }}>
                {files.length > 0 && (
                    <Typography variant="body2">
                        Selected Files:
                    </Typography>
                )}
                {files.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2">{file.name}</Typography>
                        <Button variant="outlined" color="error" onClick={() => handleRemoveFile(file)}>
                            Remove
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default FileDropArea;