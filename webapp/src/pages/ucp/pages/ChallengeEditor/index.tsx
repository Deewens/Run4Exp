import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Editor from "./Editor";
import ImageUpload from "./ImageUpload";
import useChallengeImage from "../../../../api/challenges/useChallengeImage";
import {useEffect, useState} from "react";
import {useRouter} from "../../../../hooks/useRouter";
import useMain from "../../useMain";
import {CircularProgress} from "@material-ui/core";
import {useSnackbar} from "notistack";


const useStyles = makeStyles({
  mapContainer: {
    height: '800px',
    width: '100%',
  },
  loading: {
    height: 'calc(100vh - 150px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ChallengeEditor = () => {
  const classes = useStyles();

  const router = useRouter();
  const main = useMain()
  useEffect(() => {
    main.toggleSidebar(false)
  }, [])

  const {enqueueSnackbar} = useSnackbar()

  // @ts-ignore
  let {id} = router.query;

  const {isLoading, isSuccess, error, data} = useChallengeImage(parseInt(id));
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = () => {
    enqueueSnackbar("Image téléversé avec succès.", {
      variant: 'success'
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setImageUrl(data!)
    }
  }, [isSuccess])

  return (
    <>
      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress/>
        </div>
      )}

      {imageUrl ? (
        <Editor image={imageUrl} />
      ) : <ImageUpload onImageUpload={handleImageUpload}/>}

    </>
  )
}

export default ChallengeEditor