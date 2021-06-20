import {useMutation} from "react-query";
import {ChallengeCreate, ChallengeCreated} from "../../type";
import axios from "axios";

type ChallengeImageUpload = {
  id: number,
  image: Blob
}

const uploadChallengeImage = async (imageData: ChallengeImageUpload): Promise<undefined> => {
  const formData = new FormData();
  formData.append('file', imageData.image);
  const { data } = await axios.put(
    '/challenges/' + imageData.id + '/background',
    formData,
    {
      responseType: undefined,
    }
  );

  return data
}

/**
 * Update the background of a challenge
 *
 */
export default function useUploadChallengeImage() {
  return useMutation((data: ChallengeImageUpload) => uploadChallengeImage(data), {
    onError(error) {
      console.log(error)
    }
  })
}