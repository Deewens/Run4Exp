import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Editor from "./Editor";
import ImageUpload from "./ImageUpload";
import useChallengeImage from "../../../../api/useChallengeImage";
import {useEffect, useState} from "react";
import {useRouter} from "../../../../hooks/useRouter";
import useMain from "../../useMain";



const useStyles = makeStyles({
  mapContainer: {
    height: '800px',
    width: '100%',
  },
  loading: {
    height: '100vh',
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


  // @ts-ignore
  let {id} = router.query;

  const {isLoading, isError, isSuccess, error, data} = useChallengeImage(parseInt(id));
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = () => {

  }

  useEffect(() => {
    if (isSuccess) {
      setImageUrl(data!)
    }
  }, [isSuccess])


  return (
    <>
      {
        imageUrl
          ? <Editor image={imageUrl} />
          : <ImageUpload onImageUpload={handleImageUpload}/>
      }
    </>
  )
}

export default ChallengeEditor