export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { prompt } = await req.json();

        // This is our secret marketing prompt formula
        const systemPrompt = `You are an expert LinkedIn content strategist with a knack for creating viral posts. A user will provide a topic. Your task is to generate 3 distinct, engaging LinkedIn post ideas based on that topic.

        Each post idea must have the following structure, clearly labeled:
        
        **Post Idea [Number]:**
        **Hook:** A scroll-stopping first line (1-2 sentences) that creates curiosity or states a bold opinion.
        **Body:** 3-5 bullet points that expand on the hook with valuable insights, data, or actionable tips.
        **CTA (Call to Action):** A question or prompt to encourage comments and engagement.
        
        Maintain a professional but conversational tone. Use emojis where appropriate to increase readability. Format your entire response using Markdown for clarity. Ensure there is a line break between each complete post idea.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 800,
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const resultText = data.choices[0].message.content;

        return new Response(JSON.stringify({ result: resultText.trim() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
