import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 8,
    position: "relative",
    color: "#043f5f",
    backgroundColor: theme.palette.background.paper,
    fontSize: 22,
    padding: "16px 26px 16px 20px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      color: "#043f5f",
      borderRadius: 8,
      borderColor: "#80bdff",
      backgroundColor: theme.palette.background.paper,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
}));

export default function MaterialSelect({ onChange, value, name, subjects }) {
  const classes = useStyles();
  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          className="selectCustom"
          name={name}
          value={value}
          onChange={onChange}
          input={<BootstrapInput />}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
