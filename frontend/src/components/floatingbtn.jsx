import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';

const Floatingbtn = () => {
    return (
        <Box
            sx={{
                position: 'fixed',   
                bottom: 16,         
                right: 16,          
                '& > :not(style)': { m: 1 },
            }}
        >
            <Fab variant="extended" color="primary">
                <EditIcon sx={{ mr: 1 }} />
                일지 쓰기
            </Fab>
        </Box>
    );
}

export default Floatingbtn;
