import {useMutation} from "react-query";
import {ChallengeCreate, ChallengeCreated} from "./type";
import axios from "axios";

type AvatarUpload = {
  image: Blob
}

const uploadChallengeImage = async (imageData: AvatarUpload): Promise<undefined> => {
  const formData = new FormData();
  formData.append('file', imageData.image);
  const { data } = await axios.put(
    '/users/avatar',
    formData,
    {
      responseType: undefined,
    }
  );

  return data
}

export default function useUploadChallengeImage() {
  return useMutation((data: AvatarUpload) => uploadChallengeImage(data))
}