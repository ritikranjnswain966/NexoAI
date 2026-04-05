import Chat from "../models/Chat.js";
import User from "../models/User.js";
import ai from "../configs/gemini.js";
import imagekit from "../configs/imageKit.js";

// Text-based AI Chat Message Controller (SSE Streaming with Gemini SDK)
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt, aiModel } = req.body;

    // Model configs: map frontend selection to Gemini model IDs and credit costs
    const modelConfigs = {
      basic: { id: "gemini-2.5-flash-lite", cost: 1 },
      medium: { id: "gemini-2.5-flash", cost: 2 },
      pro: { id: "gemini-2.5-pro", cost: 4 },
      high: { id: "gemini-3.1-pro-preview", cost: 8 },
    };
    const config = modelConfigs[aiModel] || modelConfigs.medium;

    //check credits
    if (req.user.credits < config.cost) {
      return res.json({
        success: false,
        message: `Not enough credits. ${aiModel || "medium"} needs ${config.cost} credits.`,
      });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // SSE headers for real-time streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const systemInstruction = `You are a highly capable AI assistant. The current date and local time is ${new Date().toLocaleString()}. Always use this real-time information when the user asks about the date or time.`;

    // Stream using native Gemini SDK
    const stream = await ai.models.generateContentStream({
      model: config.id,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    let fullText = "";
    let aborted = false;

    req.on("close", () => {
      aborted = true;
    });

    for await (const chunk of stream) {
      if (aborted) break;
      const content = chunk.text || "";
      if (content) {
        fullText += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    if (!aborted) {
      res.write(`data: [DONE]\n\n`);
      res.end();
    }

    // Save full or partial response to DB
    if (fullText) {
      chat.messages.push({
        role: "assistant",
        content: fullText,
        timestamp: Date.now(),
        isImage: false,
      });
      await chat.save();
      await User.updateOne(
        { _id: userId },
        { $inc: { credits: -config.cost } },
      );
    }
  } catch (error) {
    if (!res.headersSent) {
      res.json({ success: false, message: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
};

//Image generation Controller

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    //check credits
    if (req.user.credits < 2) {
      return res.json({ success: false, message: "Insufficient credits" });
    }
    const { prompt, chatId, isPublished } = req.body;
    //find chat
    const chat = await Chat.findOne({ userId, _id: chatId });

    //push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // --- NEW: GEMINI 3.1 IMAGE GENERATION (Via generateContent) ---
    // Generate the image using Google Gemini 3.1 Flash Image Preview
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
    });

    let base64Image = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        // Construct the base64 data URI expected by ImageKit upload
        base64Image = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!base64Image) {
      throw new Error("No image was returned from the Gemini model.");
    }

    //Upload image to ImageKit
    const uploadResponse = await imagekit.files.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "nexo",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
