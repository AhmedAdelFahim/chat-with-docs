/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

class DocumentsManagementService {
    private readonly baseURL = process?.env?.NEXT_PUBLIC_BOT_URL || '';
    constructor() {}
    async listDocuments() {
        const res = await axios.get(`${this.baseURL}/v1/docs/list`);
        return res
     
    }

    async deleteDocument(uuid: string) {
        const res = await axios.delete(`${this.baseURL}/v1/docs/${uuid}`);
        return res
     
    }

    async appDocument(data: any) {
        const res = await axios.post(`${this.baseURL}/v1/docs/load`, data);
        return res
     
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DocumentsManagementService();