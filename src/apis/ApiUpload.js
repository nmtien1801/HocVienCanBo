import { ApiManager } from "./ApiManager";

const ApiUpload = {
  UploadFileApi: () => ApiManager.post(`/fileupload/upload`),
  GetFileApi: (imagePath) => {
    return ApiManager.getImageBinary(`/file/image?fileName=${imagePath}`);
  },
};

export default ApiUpload;
