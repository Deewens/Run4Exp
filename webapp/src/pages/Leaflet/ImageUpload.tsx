import * as React from 'react';
import Dropzone from 'react-dropzone';
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import {SetStateAction, useCallback, useState} from "react";

const useStyles = makeStyles({
});

type Props = {
  setImage: (value: SetStateAction<string | null>) => void
}

const ImageUpload = ({setImage}: Props) => {
  const classes = useStyles();


  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      let file = acceptedFiles[0];
      let url = URL.createObjectURL(file);
      let image = new Image();
      image.src = url;
      image.onload = () => {
        setImage(url);
      }
    }

  }, [])

  return (
    <Box
      sx={{
        m: 2,
        border: '1px solid black',
        height: 150,
      }}
    >
      <Dropzone
        onDrop={onDrop}
        accept="image/*"
      >
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()}/>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
    </Box>
  );
}

export default ImageUpload;