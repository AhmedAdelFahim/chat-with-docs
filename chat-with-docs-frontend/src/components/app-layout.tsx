"use client"

import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default function AppLayout({children, selectedPage}: any) {
    const router = useRouter();
    return (<div className="w-100 h-100 d-flex flex-column">
        <div className="d-flex flex-row">
            <div className="p-3 d-flex justify-content-center w-100">
                <button disabled={selectedPage === "DOCUMENTS_PAGE"} onClick={() => {
                    router.push("/documents-management")
                }} className="btn btn-dark mx-2">
                    Documents Management
                </button>
                <button onClick={() => {
                    router.push("/chat")
                }} disabled={selectedPage === 'CHAT_PAGE'} className="btn btn-dark mx-2">
                    Chat
                </button>
            </div>
        </div>
        {children}
    </div>
    );
  }
  