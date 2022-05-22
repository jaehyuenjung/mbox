export const withPreviews =
  (dropHandler: { (...args: any[]): any; (arg0: any, arg1: any): void }) =>
  (accepted: any[], rejected: any) => {
    const acceptedWithPreview = accepted.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    dropHandler(acceptedWithPreview, rejected);
  };

export const clearPreviews = (files: any[]) =>
  files.forEach((file) => URL.revokeObjectURL(file.preview));
