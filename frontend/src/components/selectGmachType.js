import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGmachKindsApi } from '../redux/api/gmachimAPI';

export const SelectGmachType = (props) => {
    const {type, setType} = props
 
    const dispatch = useDispatch();
  const gmachimTypes = useSelector(state=>state.gmachim.gmachimTypes)
  const kindsFetched = useSelector((state) => state.gmachim.gmachKindsFetched);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  React.useEffect(() => {
    const hasTypes = Array.isArray(gmachimTypes) && gmachimTypes.length > 0;
    if (hasTypes || kindsFetched) return;
    dispatch(getAllGmachKindsApi());
  }, [dispatch, gmachimTypes, kindsFetched]);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">סוג גמח</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="סוג גמח"
          onChange={handleChange}
        >
            {gmachimTypes.map((type)=> <MenuItem key={type.gmachKindCode} value={type.gmachKindCode}>{type.gmachTypes}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}
