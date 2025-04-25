import { quillbot } from "quillbot-api";

export const paraphraseText = async (text: string) => {
    try {
        const paraphrased = await quillbot(text);
        return paraphrased; 
    } catch (error) {
        console.error('Error paraphrasing text:', error);
        throw new Error('Failed to paraphrase text');
    }
};
