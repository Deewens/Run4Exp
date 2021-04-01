import {
  Box,
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField, Theme, useTheme
} from "@material-ui/core";
import * as React from "react";
import {SetStateAction, useMemo, useState} from "react";
import {Slate, withReact} from "slate-react";
import {
  BalloonToolbar, BoldPlugin,
  DEFAULTS_ALIGN,
  DEFAULTS_BLOCKQUOTE,
  DEFAULTS_BOLD,
  DEFAULTS_CODE,
  DEFAULTS_CODE_BLOCK,
  DEFAULTS_HEADING, DEFAULTS_HIGHLIGHT,
  DEFAULTS_IMAGE,
  DEFAULTS_ITALIC,
  DEFAULTS_KBD,
  DEFAULTS_LINK,
  DEFAULTS_LIST,
  DEFAULTS_MEDIA_EMBED,
  DEFAULTS_MENTION,
  DEFAULTS_PARAGRAPH, DEFAULTS_SEARCH_HIGHLIGHT,
  DEFAULTS_STRIKETHROUGH,
  DEFAULTS_SUBSUPSCRIPT,
  DEFAULTS_TABLE,
  DEFAULTS_TODO_LIST,
  DEFAULTS_UNDERLINE,
  EditablePlugins, HeadingPlugin,
  HeadingToolbar, ItalicPlugin,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE, ParagraphPlugin, pipe,
  setDefaults,
  SlateDocument, StrikethroughPlugin, ToolbarButtonProps,
  ToolbarElement,
  ToolbarMark, UnderlinePlugin
} from "@udecode/slate-plugins";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import StrikethroughSIcon from "@material-ui/icons/StrikethroughS";
import {createEditor, Node} from "slate";
import {withHistory} from "slate-history";
import {makeStyles} from "@material-ui/core/styles";
import useUpdateChallenge from "../../../../api/useUpdateChallenge";
import {useRouter} from "../../../../hooks/useRouter";
import {IStyleFunctionOrObject} from "@uifabric/utilities";
import {
  ToolbarButtonStyleProps,
  ToolbarButtonStyles
} from "@udecode/slate-plugins/dist/components/ToolbarButton/ToolbarButton.types";

const plugins = [ParagraphPlugin(), BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), HeadingPlugin(), StrikethroughPlugin()]
const withPlugins = [withReact, withHistory] as const

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

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    // width: '100%',
    //
    // border: '1px solid black',
  },
  editor: {
    // minHeight: '300px',
    // overflow: 'auto',
  }
}))

type Props = {
  open: boolean
  setOpen: (value: SetStateAction<boolean>) => void
  name: string
  shortDescription: string
  htmlDescription: string
}

const UpdateChallengeInfosDialog = (props: Props) => {
  const classes = useStyles()
  const theme = useTheme()
  const toolbarElementStyles: IStyleFunctionOrObject<ToolbarButtonStyleProps, ToolbarButtonStyles> = {
    root: {
      color: theme.palette.text.primary
    }
  }
  const {
    open,
    setOpen
  } = props;

  const router = useRouter()
  //@ts-ignore
  let id = parseInt(router.query.id)

  const updateChallenge = useUpdateChallenge()

  const [name, setName] = useState(props.name)
  const [shortDescription, setShortDescription] = useState(props.shortDescription)
  const [richTextDescription, setRichTextDescription] = useState(initialValue)
  const descriptionEditor = useMemo(() => pipe(createEditor(), ...withPlugins), [])

  const handleClose = (e: object, reason: string) => {
    if (reason === "escapeKeyDown" || reason === "backdropClick") return
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false);
  }

  const handleUpdateChallenge = () => {
    updateChallenge.mutate({
      id: id,
      scale: 100,
      name: name,
      description: shortDescription
    }, {
      onSuccess() {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Informations du challenge</DialogTitle>
      <Divider/>
      <DialogContent>
        <DialogContentText>
          Merci d'indiquer le nom et la description du challenge.
        </DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          <TextField
            required
            autoFocus
            margin="dense"
            id="challenge-name"
            label="Nom du challenge"
            sx={{marginBottom: 2, width: 400}}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            required
            id="challenge-short-description"
            label="Description courte"
            multiline
            rows={3}
            fullWidth
            sx={{marginBottom: 2}}
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
          />
          <div className={classes.container}>
            <div className={classes.editor}>
              <Slate
                editor={descriptionEditor}
                value={richTextDescription}
                onChange={newValue => {
                  setRichTextDescription(newValue as SlateDocument)
                  const content = JSON.stringify(richTextDescription)
                  localStorage.setItem('content', content)
                  console.log(newValue);
                }}
              >
                <HeadingToolbar>
                  <ToolbarElement type={options.h1.type} icon={'H1'} styles={toolbarElementStyles}/>
                  <ToolbarElement type={options.h2.type} icon={'H2'} styles={toolbarElementStyles}/>
                  <ToolbarElement type={options.h3.type} icon={'H3'} styles={toolbarElementStyles}/>
                  <ToolbarElement type={options.h4.type} icon={'H4'} styles={toolbarElementStyles}/>
                  <ToolbarElement type={options.h5.type} icon={'H5'} styles={toolbarElementStyles}/>
                  <ToolbarElement type={options.h6.type} icon={'H6'} styles={toolbarElementStyles}/>
                  <ToolbarMark type={MARK_BOLD} icon={<FormatBoldIcon/>} styles={toolbarElementStyles}/>
                  <ToolbarMark type={MARK_ITALIC} icon={<FormatItalicIcon/>} styles={toolbarElementStyles}/>
                  <ToolbarMark type={MARK_UNDERLINE} icon={<FormatUnderlinedIcon/>} styles={toolbarElementStyles}/>
                  <ToolbarMark type={MARK_STRIKETHROUGH} icon={<StrikethroughSIcon/>} styles={toolbarElementStyles}/>
                </HeadingToolbar>
                <BalloonToolbar arrow>
                  <ToolbarMark
                    reversed
                    type={MARK_BOLD}
                    icon={'B'}
                    tooltip={{content: 'Bold (CTRL+B)'}}
                  />
                  <ToolbarMark
                    reversed
                    type={MARK_ITALIC}
                    icon={'I'}
                    tooltip={{content: 'Italic (CTRL+I)'}}
                  />
                  <ToolbarMark
                    reversed
                    type={MARK_UNDERLINE}
                    icon={'U'}
                    tooltip={{content: 'Underline (CTRL+U)'}}
                  />
                </BalloonToolbar>
                <EditablePlugins plugins={plugins} placeholder="Entrer la description..."/>
              </Slate>
            </div>
          </div>
        </Box>
      </DialogContent>
      <Divider/>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button onClick={handleUpdateChallenge}>Sauvegarder</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateChallengeInfosDialog