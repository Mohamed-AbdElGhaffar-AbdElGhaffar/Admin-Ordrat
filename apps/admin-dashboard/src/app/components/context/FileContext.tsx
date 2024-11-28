'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type FileContextType = {
  fileData: boolean;
  setFileData: React.Dispatch<React.SetStateAction<boolean>>;
  updateData: boolean;
  setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
  updateReviews: boolean;
  setUpdateReviews: React.Dispatch<React.SetStateAction<boolean>>;
  updateBuyers: boolean;
  setUpdateBuyers: React.Dispatch<React.SetStateAction<boolean>>;
  updateStores: boolean;
  setUpdateStores: React.Dispatch<React.SetStateAction<boolean>>;
  updateAccounts: boolean;
  setUpdateAccounts: React.Dispatch<React.SetStateAction<boolean>>;
  updateSeller: boolean;
  setUpdateSeller: React.Dispatch<React.SetStateAction<boolean>>;
  updateFaq: boolean;
  setUpdateFaq: React.Dispatch<React.SetStateAction<boolean>>;

  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fileData, setFileData] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [updateReviews, setUpdateReviews] = useState<boolean>(false);
  const [updateBuyers, setUpdateBuyers] = useState<boolean>(false);
  const [updateStores, setUpdateStores] = useState<boolean>(false);
  const [updateAccounts, setUpdateAccounts] = useState<boolean>(false);
  const [updateSeller, setUpdateSeller] = useState<boolean>(false);
  const [updateFaq, setUpdateFaq] = useState<boolean>(false);
 
  const [login, setLogin] = useState<boolean>(false);

  return (
    <FileContext.Provider value={{ fileData, setFileData, updateData, setUpdateData, updateReviews, setUpdateReviews, updateBuyers, setUpdateBuyers, updateStores, setUpdateStores, updateAccounts, setUpdateAccounts, updateSeller, setUpdateSeller, updateFaq, setUpdateFaq, login, setLogin }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
