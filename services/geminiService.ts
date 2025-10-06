import { GoogleGenAI, Type } from "@google/genai";

export async function generateAmenitySuggestions(ai: GoogleGenAI, roomName: string): Promise<string[]> {
    const prompt = `Based on the room name "${roomName}", suggest a list of 5 to 7 common amenities. Return the list as a simple JSON array of strings.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // FIX: The response schema now correctly requests a simple array, matching the prompt.
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                    description: "A suggested amenity for the room."
                }
            }
        },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Empty response from API");
    }

    try {
        const parsed = JSON.parse(jsonText);
        // FIX: The parsing logic now correctly handles a direct array response.
        if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === 'string');
        }
        console.warn("Gemini did not return an array for amenity suggestions.");
        return [];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("Invalid JSON response from API");
    }
}
