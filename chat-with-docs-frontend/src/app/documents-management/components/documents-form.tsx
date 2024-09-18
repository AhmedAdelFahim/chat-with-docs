/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import AppUploader from "@/components/app-uploader";
import styles from "./page.module.css";
import AppSelect, { IOption } from "@/components/app-select";
import { useEffect, useState } from "react";
import AppInput from "@/components/app-input";
import { IInputChangedValue } from "@/components/input.interface";
import documentsManagementService from "../documents-management.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DocumentsForm({ collections }: any) {
  const [categoriesOptions, setCategoriesOptions] = useState<IOption[]>([{
    value: "NEW", label: 'New Category',
  } ]);

  const [model, setModel] = useState<any>({
    newCategoryName: '',
    category: categoriesOptions[0],
    document: null,
  });
  
  useEffect(()=> {
    if (model.category.value === 'NEW') {
      setModel({...model, newCategoryName: ''})
    } else {
      setModel({...model, newCategoryName: model.category.value})
    }
  }, [model.category]);

  useEffect(() => {
    setCategoriesOptions([...categoriesOptions, ...collections.map((category: any) => ({value: category.name, label: `${category.name} - chunks (${category.chunks_num})`}))])
  }, [collections])

  const handleCategoryChange = (selected: IOption) => {
    setModel({...model, category: selected})
  }

  const handleCategoryNameChange = (val: IInputChangedValue) => {
    setModel({...model, newCategoryName: val.value})
  }

  const handleDocumentChange = (val: IInputChangedValue) => {
    setModel({...model, document: val.value})
  }

  const saveDocument = async () => {
    const formData = new FormData();
    formData.append('category_name', model.newCategoryName);
    formData.append('file', new Blob([model.document], {type: model.document.type}));
    await documentsManagementService.appDocument(formData)
    setModel({...model, document: null})
    window?.location?.reload();
  }
    return (
      <div className={styles.documents_form_container}>
        <AppUploader name="document" accept=".txt, .text" label="Upload Document" onChange={handleDocumentChange}/>
        <AppSelect label="Select Category" options={categoriesOptions} onChange={handleCategoryChange} value={model.category}/>
        <AppInput disabled={model.category.value !== 'NEW'} label="Category Name" placeholder="Category Name" value={model.newCategoryName} name="categoryName" onChange={handleCategoryNameChange} type="text"/>
        <button disabled={!model?.document || (model.category.value === 'NEW' && model.newCategoryName.length === 0)} className="btn btn-success w-25" onClick={saveDocument}>Save</button>
      </div>
    );
  }
  