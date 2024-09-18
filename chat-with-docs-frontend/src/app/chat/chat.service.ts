import axios from "axios";

class ChatService {
    private readonly baseURL = process?.env?.NEXT_PUBLIC_BOT_URL || '';
    constructor() {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async askQuestion(type: 'TEXT' | 'AUDIO',data: any) {
        if (type === 'TEXT') {
            const res = await axios.post(`${this.baseURL}/v1/chat/ask`, {
                model_name: data.modelName,
                response_type: data.responseType,
                response_lang: data.responseLang,
                category_name: data.categoryName,
                question: data.q,
            },{
                responseType: data.responseType === 'TEXT'? 'json' : 'blob',
            });
            
            return res
        }
    }
}

export default new ChatService();