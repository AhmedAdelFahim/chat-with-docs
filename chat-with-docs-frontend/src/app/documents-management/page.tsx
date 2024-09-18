"use client"
import AppLayout from "@/components/app-layout";
import DocumentsManagement from "./components/documents-management";

export default function DocumentsManagementPage() {
  
  return (
    <AppLayout selectedPage={"DOCUMENTS_PAGE"}>
      <DocumentsManagement/>
    </AppLayout>
    
  );
}
