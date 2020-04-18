import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

import subjects from "../../models/Subject";
import classrooms from "../../models/Classroom";
import { Checkbox, ListItemText } from "@material-ui/core";

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 8,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    fontSize: 22,
    padding: "11px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
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

export default function MultipleSelect({ onChange, value, name }) {
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
          multiple
          onChange={onChange}
          renderValue={(selected) => selected.join(", ")}
          input={<BootstrapInput />}
        >
          {name === "subject"
            ? subjects.map((subject) => (
                <MenuItem key={subject.name} value={subject.name}>
                  <Checkbox checked={value.indexOf(subject.name) > -1} />
                  <ListItemText primary={subject.label} />
                </MenuItem>
              ))
            : classrooms.map((classroom) => (
                <MenuItem key={classroom.name} value={classroom.name}>
                  <Checkbox checked={value.indexOf(classroom.name) > -1} />
                  <ListItemText primary={classroom.label} />
                </MenuItem>
              ))}
        </Select>
      </FormControl>
    </div>
  );
}
