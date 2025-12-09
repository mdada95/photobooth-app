export interface IPhotoStorageSchema {
  data: Blob;
  createdAt: Date; // Timestamp when the photo was taken
}

export class PhotoStorageSchema implements IPhotoStorageSchema {
  constructor(
    public data: Blob,
    public createdAt: Date,
  ) {}

  static adapt (item: any): PhotoStorageSchema {
    return new PhotoStorageSchema(
      item?.data,
      new Date(item?.createdAt)
    );
  }
}
