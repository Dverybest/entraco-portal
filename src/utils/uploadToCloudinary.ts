import { RcFile, UploadFile } from "antd/es/upload";

interface ICloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  original_extension: string;
}

export const cloudinaryUpload = async (fileList: RcFile) => {
  try {
    const formData = new FormData();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
    const presetKey = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET ?? "";
    formData.append("file", fileList);
    formData.append("cloud_name", cloudName);
    formData.append("upload_preset", presetKey);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    if (res.ok) {
      return (await res.json()) as ICloudinaryResponse;
    }
    throw await res.json();
  } catch (error) {
    throw error;
  }
};

export const fileSizeInMegabytes = (
  fileList: UploadFile<File>[] | undefined
) => {
  let currentSize = 0;

  if (fileList) {
    currentSize = fileList.reduce((acc, file) => {
      if (file.size !== undefined) {
        return acc + file.size;
      } else {
        return acc;
      }
    }, 0);
  }

  const sizeInMegabytes = (currentSize / 1000000).toFixed(2);

  return parseFloat(sizeInMegabytes);
};
