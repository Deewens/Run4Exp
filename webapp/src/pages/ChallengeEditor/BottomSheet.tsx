import * as React from 'react';
import {Divider, Drawer, Fab, IconButton, TextField, Theme, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import { createEditor } from 'slate'
import {useMemo, useState} from "react";
import {Editable, Slate, withReact} from "slate-react";
import {Node} from 'slate'

const useStyles = makeStyles((theme: Theme) => ({
  buttons: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    zIndex: 999,
  }
}));

const BottomSheet = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const [description, setDescription] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }]
    }
  ])

  const descriptionEditor = useMemo(() => withReact(createEditor()), [])


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  }

  return (
    <>
      <div className={classes.buttons}>
      {open
        ? <IconButton onClick={handleDrawerClose}><KeyboardArrowDownOutlinedIcon/></IconButton>
        : <IconButton onClick={handleDrawerOpen}><KeyboardArrowUpOutlinedIcon/></IconButton>}
      </div>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography variant="h3">
          Description
        </Typography>
        <Slate
          editor={descriptionEditor}
          value={description}
          onChange={newValue => setDescription(newValue)}
        >
          <Editable />
        </Slate>
      </Drawer>
    </>
  )
}

export default BottomSheet