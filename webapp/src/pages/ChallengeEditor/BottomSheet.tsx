// @refresh reset
import * as React from 'react';
import {
  Button,
  Drawer, Icon,
  IconButton,
  Theme,
  Typography,
  useTheme
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import {createEditor, Node, Editor, Transforms, Text, Element as SlateElement} from 'slate'
import {useCallback, useMemo, useState} from "react";
import {Editable, RenderElementProps, RenderLeafProps, Slate, withReact} from "slate-react";
import { withHistory } from 'slate-history'
import ElementButton from "../../components/slate/ElementButton"
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import {
  ParagraphPlugin,
  BoldPlugin,
  EditablePlugins,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  pipe, SlateDocument,
  HeadingToolbar,
  HeadingPlugin,
  ToolbarMark,
  ToolbarElement,
  BalloonToolbar,
  setDefaults,
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING,
  DEFAULTS_HIGHLIGHT,
  DEFAULTS_IMAGE,
  DEFAULTS_ITALIC,
  DEFAULTS_KBD,
  DEFAULTS_LINK,
  DEFAULTS_LIST,
  DEFAULTS_MEDIA_EMBED,
  DEFAULTS_MENTION,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_SEARCH_HIGHLIGHT,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_SUBSUPSCRIPT,
  DEFAULTS_TABLE,
  DEFAULTS_TODO_LIST,
  DEFAULTS_UNDERLINE, MARK_BOLD, MARK_STRIKETHROUGH, MARK_UNDERLINE, MARK_ITALIC,  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/slate-plugins"
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS'

const plugins = [ParagraphPlugin(), BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), HeadingPlugin(), StrikethroughPlugin()]
const withPlugins = [withReact, withHistory] as const

const useStyles = makeStyles((theme: Theme) => ({
  drawerContent: {
    margin: '0 auto',
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    zIndex: 999,
  },
  container: {
    width: '45rem',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid black',
    margin: theme.spacing(2)

  },
  editor: {
    height: '300px',
    overflow: 'auto',
  }
}));

export const headingTypes = [
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
]

const options = {
  ...setDefaults(DEFAULTS_PARAGRAPH, {}),
  ...setDefaults(DEFAULTS_MENTION, {}),
  ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
  ...setDefaults(DEFAULTS_CODE_BLOCK, {}),
  ...setDefaults(DEFAULTS_LINK, {}),
  ...setDefaults(DEFAULTS_IMAGE, {}),
  ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
  ...setDefaults(DEFAULTS_TODO_LIST, {}),
  ...setDefaults(DEFAULTS_TABLE, {}),
  ...setDefaults(DEFAULTS_LIST, {}),
  ...setDefaults(DEFAULTS_HEADING, {}),
  ...setDefaults(DEFAULTS_ALIGN, {}),
  ...setDefaults(DEFAULTS_BOLD, {}),
  ...setDefaults(DEFAULTS_ITALIC, {}),
  ...setDefaults(DEFAULTS_UNDERLINE, {}),
  ...setDefaults(DEFAULTS_STRIKETHROUGH, {}),
  ...setDefaults(DEFAULTS_CODE, {}),
  ...setDefaults(DEFAULTS_KBD, {}),
  ...setDefaults(DEFAULTS_SUBSUPSCRIPT, {}),
  ...setDefaults(DEFAULTS_HIGHLIGHT, {}),
  ...setDefaults(DEFAULTS_SEARCH_HIGHLIGHT, {}),
}

const initialValue: Node[] = [
  {
    type: options.p.type,
    children: [
      {
        text: 'This text is bold, italic and underlined.',
        [options.bold.type]: true,
        [options.italic.type]: true,
        [options.underline.type]: true,
      },
    ],
  }
];


const BottomSheet = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const [description, setDescription] = useState(initialValue)



  const descriptionEditor = useMemo(() => pipe(createEditor(), ...withPlugins), [])


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
        <div className={classes.drawerContent}>
          <Typography variant="h5">
            Description
          </Typography>
          <div className={classes.container}>
            <div className={classes.editor}>
              <Slate
                editor={descriptionEditor}
                value={description}
                onChange={newValue => {
                  setDescription(newValue as SlateDocument)
                  const content = JSON.stringify(description)
                  localStorage.setItem('content', content)
                }}
              >
                <HeadingToolbar>
                  <ToolbarElement type={options.h1.type} icon={'H1'} />
                  <ToolbarElement type={options.h2.type} icon={'H2'} />
                  <ToolbarElement type={options.h3.type} icon={'H3'} />
                  <ToolbarElement type={options.h4.type} icon={'H4'} />
                  <ToolbarElement type={options.h5.type} icon={'H5'} />
                  <ToolbarElement type={options.h6.type} icon={'H6'} />
                  <ToolbarMark type={MARK_BOLD} icon={<FormatBoldIcon />} />
                  <ToolbarMark type={MARK_ITALIC} icon={<FormatItalicIcon />} />
                  <ToolbarMark type={MARK_UNDERLINE} icon={<FormatUnderlinedIcon />} />
                  <ToolbarMark type={MARK_STRIKETHROUGH} icon={<StrikethroughSIcon />} />
                </HeadingToolbar>
                <BalloonToolbar arrow>
                  <ToolbarMark
                    reversed
                    type={MARK_BOLD}
                    icon={'B'}
                    tooltip={{ content: 'Bold (CTRL+B)' }}
                  />
                  <ToolbarMark
                    reversed
                    type={MARK_ITALIC}
                    icon={'I'}
                    tooltip={{ content: 'Italic (CTRL+I)' }}
                  />
                  <ToolbarMark
                    reversed
                    type={MARK_UNDERLINE}
                    icon={'U'}
                    tooltip={{ content: 'Underline (CTRL+U)' }}
                  />
                </BalloonToolbar>
                <EditablePlugins plugins={plugins} placeholder="Entrer la description..." />
              </Slate>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default BottomSheet