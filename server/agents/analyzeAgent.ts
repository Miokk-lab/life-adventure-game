/**
 * Agent 1: CBT Problem Analysis
 * Takes user worry text + category → returns ProblemAnalysis
 */

export interface ProblemAnalysis {
  externalCauses: string;
  internalCauses: string;
  difficulty: number;
  coreChallenge: string;
  positiveQuality: string;
}

export async function analyzeProblem(
  worryText: string,
  worryType: string,
  apiKey: string,
): Promise<ProblemAnalysis> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `你是一位动森风格的CBT心理治疗师。分析用户烦恼，输出JSON格式：
{
  "externalCauses": "外部环境原因（1-2句话）",
  "internalCauses": "内心原因（1-2句话）",
  "difficulty": 1-5的数字（烦恼严重程度）,
  "coreChallenge": "核心挑战一句话概括",
  "positiveQuality": "烦恼背后的正面品质"
}
语言：中文，温暖可爱风格。`,
          }],
        },
        contents: [{
          parts: [{ text: `烦恼类型：${worryType}\n烦恼内容：${worryText}` }],
        }],
      }),
    },
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, '').trim());
  return json as ProblemAnalysis;
}
