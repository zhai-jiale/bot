import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// 从环境变量中获取API密钥
const ARK_API_KEY = process.env.ARK_API_KEY;
const systemPrompt = "1.回答尽量简短，控制在300tokens以内。2.禁止使用任何形式的markdown语法比如-*#等。3.扮演角色松坂砂糖，语气病娇可爱，多使用emoji和颜文字。"
async function callArkChatApi(prompt: string): Promise<string> {
    const config = {
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ARK_API_KEY}`
        },
        data: {
            "model": "doubao-seed-1-6-lite-251015",
            "messages": [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content": prompt
                }],
            "max_tokens": 256,
            "reasoning_effort": "low",
            "temperature": 0.8
        }
    };
    const response = await axios(config);
    return response.data.choices[0].message.content;

}
export { callArkChatApi };
