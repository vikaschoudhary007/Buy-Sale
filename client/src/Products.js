import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
      marginLeft:'3vw'
      
    },
  },
}));

export default function CreateProduct(props) {
  const classes = useStyles();
  const [name,setName] = useState('');
  const [price,setPrice] = useState(0);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">Name</InputLabel>
        <OutlinedInput id="component-outlined" value={name} onChange={(event) => setName(event.target.value)} label="Name" />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">Price</InputLabel>
        <OutlinedInput id="component-outlined" value={price} onChange={(event) => setPrice(event.target.value)} label="Price" />
      </FormControl><br/>
      <Button variant="contained" color="primary"
        onClick={() => props.createProduct(name,props.web3.utils.toWei(price.toString(),"ether"))}
      >
      Add Product</Button>
    </form>
  );
}