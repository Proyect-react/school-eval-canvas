import { createContext, useContext, useState, ReactNode } from "react";

interface UploadedFile {
  file: File;
  uploadedAt: Date;
}

interface FileContextType {
  uploadedFiles: UploadedFile[];
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const addFile = (file: File) => {
    setUploadedFiles((prev) => {
      const exists = prev.some((f) => f.file.name === file.name);
      if (exists) {
        return prev.map((f) =>
          f.file.name === file.name
            ? { file, uploadedAt: new Date() }
            : f
        );
      }
      return [...prev, { file, uploadedAt: new Date() }];
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file.name !== fileName));
  };

  return (
    <FileContext.Provider value={{ uploadedFiles, addFile, removeFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
