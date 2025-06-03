import axios from 'axios';

export async function generateDefinition(term: string, termEn: string): Promise<string> {
  const prompt = `다음 금속 처리 용어에 대해 기술적으로 간결하게 정의해줘.
용어: ${term}
영문: ${termEn}
조건: 비유나 잡설 없이, 2~3문장 이내의 정의 형식으로만 작성해줘.`;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: '너는 금속 용어를 한국어로 쉽게 설명하는 도우미야.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,  // 여기에서 .env 키 불러옴
          'Content-Type': 'application/json',
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
