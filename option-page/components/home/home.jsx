import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CustomSwipeHandlers from "./showCustomSwipe";
import Db from "../../../src/lib/db";
import customTlds from "../../../src/constants/customTlds";

const db = new Db();
const parseDomain = require("parse-domain");
const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 500
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function FilledTextFields() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    url: "",
    codeString: "",
    saveBtnText: "Save"
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const saveCustomSwipeHandler = () => {
    const { url, codeString } = values;
    if (url !== "" && codeString !== "") {
      const domain = parseDomain(url, { customTlds: customTlds });
      db.set({
        [domain.domain]: {
          codeString: codeString,
          created: +new Date(),
          url: url
        }
      }).then(res => {
        alert("Saved!");
        setValues({ ...values, codeString: "", url: "", saveBtnText: "Save" });
        window.location.reload();
      });
    } else {
      alert("Empty values are not allowed");
    }
  };

  return (
    <div>
      <h3>Create Custom Handler</h3>
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="url"
          label="Url"
          value={values.url}
          onChange={handleChange("url")}
          className={classes.textField}
          margin="normal"
          variant="filled"
          inputProps={{ "aria-label": "url" }}
        />
        <TextField
          id="filled-multiline-static"
          label="Code"
          value={values.codeString}
          onChange={handleChange("codeString")}
          rows="4"
          cols="5"
          defaultValue=""
          className={classes.textField}
          margin="normal"
          variant="filled"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={saveCustomSwipeHandler}
        >
          {values.saveBtnText}
        </Button>
      </form>
      <Divider />
      <CustomSwipeHandlers />
    </div>
  );
}