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

export default function MaterialSelect({ onChange, value, name }) {
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
          <MenuItem value={"ACST"}>ACST</MenuItem>
          <MenuItem value={"APE"}>APE</MenuItem>
          <MenuItem value={"API"}>API</MenuItem>
          <MenuItem value={"APM"}>APM</MenuItem>
          <MenuItem value={"APH/CLP"}>APH/CLP</MenuItem>
          <MenuItem value={"Arte"}>Arte</MenuItem>
          <MenuItem value={"Biologia"}>Biologia</MenuItem>
          <MenuItem value={"Ed. Física"}>Ed. Física</MenuItem>
          <MenuItem value={"Eletricidade"}>Eletricidade</MenuItem>
          <MenuItem value={"E. Industrial"}>E. Industrial</MenuItem>
          <MenuItem value={"Filosofia"}>Filosofia</MenuItem>
          <MenuItem value={"Física"}>Física</MenuItem>
          <MenuItem value={"Geografia"}>Geografia</MenuItem>
          <MenuItem value={"História"}>História</MenuItem>
          <MenuItem value={"L. Inglesa"}>L. Inglesa</MenuItem>
          <MenuItem value={"L. Portuguesa"}>L. Portuguesa</MenuItem>
          <MenuItem value={"LTP"}>LTP</MenuItem>
          <MenuItem value={"LPIII/WEB"}>LPIII/WEB</MenuItem>
          <MenuItem value={"Matemática"}>Matemática</MenuItem>
          <MenuItem value={"Mobile"}>Mobile</MenuItem>
          <MenuItem value={"Micro"}>Micro</MenuItem>
          <MenuItem value={"Química"}>Química</MenuItem>
          <MenuItem value={"Sociologia"}>Sociologia</MenuItem>
          <MenuItem value={"UX"}>UX</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
