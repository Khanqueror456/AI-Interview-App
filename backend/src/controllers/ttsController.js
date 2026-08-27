import generateQuestionAudio from "../services/ttsService.js";

export const synthesizeSpeech = async (req, res) => {

    const { text } = req.body;

    if (!text || !text.trim())
    {
        return res.status(400).json({
            success : false,
            message : "Text is required"
        });
    }

    const audioUrl = await generateQuestionAudio(text);


    return res.status(200).json({
        success : true,
        audioUrl
    });
}