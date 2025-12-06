import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, WellnessPlan, NewsItem, DietPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat with Search Grounding & Multimodal Support ---

export const sendChatMessage = async (
  history: Message[],
  newMessage: string,
  attachments: { mimeType: string; data: string }[] = []
): Promise<Message> => {
  const modelId = 'gemini-2.5-flash'; 
  
  // Convert internal history to API format
  const chatHistory = history.map(h => {
    const parts: any[] = [{ text: h.text }];
    if (h.attachments && h.attachments.length > 0) {
        h.attachments.forEach(att => {
            parts.push({ inlineData: { mimeType: att.mimeType, data: att.data } });
        });
    }
    return {
      role: h.role,
      parts: parts
    };
  });

  // Construct current message parts
  const currentParts: any[] = [{ text: newMessage }];
  attachments.forEach(att => {
    currentParts.push({ inlineData: { mimeType: att.mimeType, data: att.data } });
  });

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...chatHistory,
        { role: 'user', parts: currentParts }
      ],
      config: {
        tools: [{ googleSearch: {} }], // Enable Search Grounding
        systemInstruction: `You are Dr. AI (Well Mind), an advanced medical consultant AI.
        
        YOUR MISSION:
        Provide comprehensive medical analysis, symptom checking, and health insights using your multimodal capabilities (Text, Vision, Document Understanding) and Real-time Web Search.

        RESPONSE STRUCTURE (When discussing symptoms/conditions/reports):
        1. 🩺 **Potential Analysis**: Based on symptoms/images/reports, suggest potential conditions. (Disclaimer: "AI analysis only, consult a doctor").
        2. 🔍 **Key Insights**: Explain reasoning, citing specific data points.
        3. 🛡️ **Precautions**: Immediate safety measures.
        4. 💊 **Remedies & Management**: Home remedies, OTC suggestions.
        5. 🚑 **When to see a Doctor**: Red flag symptoms.

        CRITICAL FEATURE - DOCTOR RECOMMENDATION:
        If the user's symptoms suggest they need a specific specialist (e.g., Heart issues -> Cardiologist, Skin -> Dermatologist, Bone -> Orthopedic, Child -> Pediatrician, General -> General Physician), you MUST append a special tag at the very end of your response.
        Format: <<RECOMMEND:SpecialtyName>>
        Example: "You should see a heart specialist. <<RECOMMEND:Cardiologist>>"
        Supported Specialties: Cardiologist, Neurologist, Orthopedic, Pediatrician, General Physician, Dermatologist, Oncologist, Gynecologist, Psychiatrist, ENT Specialist.

        CAPABILITIES:
        - **Image Analysis**: Detect skin conditions, interpret X-rays (general), analyze visible symptoms.
        - **Report Analysis**: Read PDF reports, explain abnormal values.
        - **Web Search**: Use Google Search for latest treatments, guidelines, or news.

        TONE: Professional, empathetic, authoritative yet cautious. Always cite sources if Web Search is used.`,
      }
    });

    const responseText = result.text || "I'm sorry, I couldn't generate a response. Please try again.";
    
    // Extract Grounding Metadata
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.filter((c: any) => c.web?.uri)
      .map((c: any) => ({ uri: c.web.uri, title: c.web.title || 'Medical Source' }));

    return {
      role: 'model',
      text: responseText,
      timestamp: new Date(),
      isGrounding: !!sources && sources.length > 0,
      sources: sources
    };

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return {
      role: 'model',
      text: "I encountered an error processing your medical request. Please try again. If uploading a file, ensure it is a valid Image or PDF.",
      timestamp: new Date()
    };
  }
};

// --- JSON Health Recommendations ---

export const generateHealthPlan = async (userContext: string): Promise<WellnessPlan | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      dailyRoutine: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            activity: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Diet', 'Exercise', 'Mental', 'Medical'] },
            status: { type: Type.STRING, enum: ['pending'] }
          },
          required: ['time', 'activity', 'category', 'status']
        }
      },
      weeklyGoals: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            target: { type: Type.STRING },
            progress: { type: Type.INTEGER }
          },
          required: ['id', 'title', 'description', 'target', 'progress']
        }
      },
      monthlyInsight: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          focusArea: { type: Type.STRING },
          summary: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['month', 'focusArea', 'summary', 'tips']
      }
    },
    required: ['dailyRoutine', 'weeklyGoals', 'monthlyInsight']
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a comprehensive, structured wellness plan for this patient profile: ${userContext}. 
      Include a daily schedule, key weekly goals, and a monthly health focus area. 
      Ensure the data is realistic and medically sound for the profile.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (result.text) {
      return JSON.parse(result.text) as WellnessPlan;
    }
    return null;
  } catch (error) {
    console.error("Gemini Plan Error:", error);
    return null;
  }
};

// --- Nutrition Plan Generation ---

export const generateDietPlan = async (userContext: string): Promise<DietPlan | null> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      dailyCalories: { type: Type.INTEGER },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          fats: { type: Type.STRING },
        },
        required: ['protein', 'carbs', 'fats']
      },
      meals: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
            name: { type: Type.STRING },
            foods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  calories: { type: Type.INTEGER }
                },
                required: ['name', 'portion', 'calories']
              }
            },
            totalCalories: { type: Type.INTEGER },
            healthBenefit: { type: Type.STRING }
          },
          required: ['type', 'name', 'foods', 'totalCalories', 'healthBenefit']
        }
      },
      hydrationGoal: { type: Type.STRING },
      avoidList: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['dailyCalories', 'macros', 'meals', 'hydrationGoal', 'avoidList']
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a strict, personalized Nutrition & Diet Plan for this patient profile: ${userContext}.
      The diet should be culturally appropriate (if region implied) and specifically target their health conditions (e.g., Diabetes, BP, Obesity).
      Include Macro breakdown, specific meals with portions, and a clear list of foods to avoid.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (result.text) {
      return JSON.parse(result.text) as DietPlan;
    }
    return null;
  } catch (error) {
    console.error("Gemini Nutrition Error:", error);
    return null;
  }
};

// --- Health News Fetching ---

export const fetchHealthNews = async (): Promise<NewsItem[]> => {
    // Note: For production, use tools: [{googleSearch: {}}] and parse the result manually.
    // Due to "MimeType invalid with tool" constraint when not using explicit JSON schema mode with search,
    // we are using a direct robust prompt or falling back to search logic.
    
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Find the top 6 latest global health, medical, and science news headlines from the last 24 hours.
            Return ONLY a valid JSON array. No markdown code blocks.
            Format: [{"title": "", "summary": "", "url": "", "source": "", "timeAgo": ""}]`,
            config: {
                tools: [{ googleSearch: {} }], 
                // NO responseMimeType here to allow Search tool to work
            }
        });

        let rawText = result.text || "";
        // Clean markdown code blocks if present
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Attempt to extract the array part if there's extra text
        const start = rawText.indexOf('[');
        const end = rawText.lastIndexOf(']');
        
        if (start !== -1 && end !== -1) {
            const jsonStr = rawText.substring(start, end + 1);
            return JSON.parse(jsonStr) as NewsItem[];
        }
        
        throw new Error("Failed to parse news JSON");
        
    } catch (e) {
        console.log("Falling back to static news due to:", e);
        // Fallback data if Search fails or quota exceeded
        return [
            {
                title: "New AI Model Detects Diabetes from Retinal Scans with 98% Accuracy",
                summary: "Researchers have developed a deep learning tool that identifies early signs of diabetes through non-invasive eye scans.",
                url: "#",
                source: "Medical News Today",
                timeAgo: "2 hours ago"
            },
            {
                title: "Global WHO Summit Highlights Need for Mental Health Infrastructure",
                summary: "World leaders gather to discuss increasing funding for mental health services in developing nations.",
                url: "#",
                source: "WHO Press",
                timeAgo: "4 hours ago"
            },
            {
                title: "Study Confirms 30 Minutes of Daily Walking Reduces Heart Risk by 35%",
                summary: "A massive longitudinal study of 50,000 participants reinforces the benefits of moderate daily activity.",
                url: "#",
                source: "Healthline",
                timeAgo: "5 hours ago"
            },
            {
                title: "Breakthrough in mRNA Vaccine Tech for Personalized Cancer Treatment",
                summary: "Early trials show promising results for custom cancer vaccines derived from patient tumor DNA.",
                url: "#",
                source: "Science Daily",
                timeAgo: "8 hours ago"
            },
            {
                title: "New Dietary Guidelines Recommend Reducing Processed Sugar Intake",
                summary: "Nutritionists update global standards, suggesting a cap of 25g of added sugar per day for adults.",
                url: "#",
                source: "Nutrition Weekly",
                timeAgo: "10 hours ago"
            },
            {
                title: "Telemedicine Usage Spikes 200% in Rural India",
                summary: "Improved connectivity and government initiatives are bringing specialist care to remote villages.",
                url: "#",
                source: "India Health",
                timeAgo: "12 hours ago"
            }
        ];
    }
};