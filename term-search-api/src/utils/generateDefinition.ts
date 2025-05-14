import axios from 'axios';

export async function generateDefinition(term: string, termEn: string): Promise<string> {
  const prompt = `${term} (${termEn})은(는) 무엇인가요? 금속 재료 분야에서 쉽게 설명해줘.`;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
        messages: [
          { role: 'system', content: '너는 금속 용어를 한국어로 쉽게 설명하는 도우미야.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,  // 여기에서 .env 키 불러옴
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
        },
      },
    );

    return res.data.choices?.[0]?.message?.content || '설명을 생성할 수 없습니다.';
  } catch (error: any) {
    console.error('🔴 GPT API 호출 실패:', error.message);
    if (error.response) {
      console.error('응답 상세:', error.response.data);
    }
    return 'GPT로 설명을 생성하는 중 오류가 발생했습니다.';
  }
}
