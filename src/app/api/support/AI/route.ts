import { NextRequest, NextResponse } from "next/server";

const geminiURL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

export const POST = async (req: NextRequest) => {
  try {
    const { message, role, targetRole } = await req.json();
    if (!message || !role || !targetRole) {
      return NextResponse.json({ suggestions: [] });
    }
    const reoleMatrix: Record<string, string> = {
      user_vendor: `
            You are replying as a USER to a VENDOR.

            GOAL : Request help or clarification.
            RULES : 
            - Clearly explain the issue or request
            - Be polite and respectful
            - Do not sound demanding or accusatory
            - Ask only what is necessary
        `,
      vendor_user: `You are replying as a VENDOR to a USER.
            GOAL : Assist the user Professionally.
            RULES:
            - Be solution-oriented
            - Acknowledge the user's concern
            - Avoid blaming the user
            - Do not overpromise timelines or refunds
            - Ask for details only if required
        `,
      vendor_admin: `
            You are replying as a VENDOR to ADMIN,
            GOAL:Escalate orclarify an issue.
            RULES : 
                - Be factual and concise 
                - Clerly state the problem
                - Include relevant technical or opertaional context
                - Ask for guidance or approval if needed
                - Avoid emotinal language
        `,
      admin_vendor: `
            You are replying as a ADMIN to a VENDOR.
            GOAL : Resolve or guide.
            RULES:
                -Be authoritative but fair
                -Request missing information if needed
                -Provide clear next steps when possible
                -Avoid unnecessary explanations
        `,
    };

    const roleKey = `${role}_${targetRole}`;
    const roleContext = reoleMatrix[roleKey] || "";

    const prompt = `
        You are an AI Assistant specialixed in short, professional support replies.
        ROLE & CONTEXT:
        ${roleContext}

            CONVERSATION CONTEXT:
            The last message you received is : ${message}

            OBJECTIVE:
            Generate exactly THREE reply suggestions that are suitablt for sending directly to the other party

            STRICT OUPUT RULES:
            - Each reply must be between 5 word or short
            - polite,professional and neuteal tone
            - Clear and context-aware
            - No Emojis
            - No explanations
            - No greeting like "HI" or "Hello"
            - No signatures
            - No repetition across suggestions
            - One reply per line
            - No numbering,bullets or symbols

            QUALITY RULES:  
            - Replies must logically respond to the message
            - Do not invent facts promise or timelines
            - If information is missing,politrly request clarification
            - Avoid generic phrases like "Let me know" unless appropriate
            - Sound human not robotic

            OUTPUT FORMATE:
                Plain text only
                Exactly three lines
    `;

    const geminiResponse = await fetch(
      `${geminiURL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await geminiResponse.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0].text || "";
    const suggestions = text
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error("Suggession error:", error);
    return NextResponse.json({ suggestions: [] });
  }
};
