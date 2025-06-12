import Papa from "papaparse";

export const handleSaveFile = (fileData: object) => {
  // Convert the object to CSV format
  const csv = Papa.unparse([fileData]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = "products.csv";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const handleFileChange = (fileObject: any, SetFile: any,dispatch:any,action:any) => {
  const input=fileObject.target;
  fileObject.preventDefault();
  const file = fileObject.target.files?.[0];
  console.log(file);
  if (!file) {
    SetFile(null);
    return;
  }
  if (file && file.type === "text/csv") {
    console.log(file);
  } else {
    dispatch(action("Please upload a valid CSV file."));
    input.value="";
    return;
  }
  SetFile(file);
};

export const handleDragOver = (e: any, setIsDragging: any) => {
  e.preventDefault();
  setIsDragging(true);
};

export const handleDragLeave = (setIsDragging: any) => {
  setIsDragging(false);
};

export const handleDrop = (
  fileObject: any,
  SetFile: any,
  setIsDragging: any,
  dispatch:any,action:any
) => {
  fileObject.preventDefault();
  setIsDragging(false);

  const droppedFile = fileObject.dataTransfer?.files[0];
  if (!droppedFile) {
    SetFile(null);
    return;
  }
  if (droppedFile?.type === "text/csv") {
    console.log(droppedFile);
  } else {
    dispatch(action("Please upload a valid CSV file."));
    return;
  }
  SetFile(droppedFile);
};
