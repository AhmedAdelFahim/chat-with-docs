'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import DocumentsForm from "./documents-form";
import documentsManagementService from "../documents-management.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DocumentsManagement() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    documentsManagementService.listDocuments().then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCategories(res.data.collections)
    });
  }, [])

    
   
const deleteCategory = async (uuid: string) => {
  documentsManagementService.deleteDocument(uuid).then((res) => {
    window?.location?.reload()
  });
}
    
    return (
      <div className="w-100 h-100 d-flex flex-row">
      <DocumentsForm collections={categories}/>
      <div className={styles.documents_list_container}>
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark text-center">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Category Name</th>
                <th scope="col">Number Of Chunks</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {
                ...categories.map((category: any) => {
                  return (<tr key={category.uuid}>
                    <td >{category.uuid}</td>
                    <td >{category.name}</td>
                    <td >{category.chunks_num}</td>
                    <td ><FontAwesomeIcon icon={faTrash} onClick={async () => {
                      await deleteCategory(category.uuid)
                    }}/></td>
                  </tr>)
                })
              }
            </tbody>
          </table>
      </div>
      </div>
      
    );
  }
  