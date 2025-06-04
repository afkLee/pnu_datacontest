export async function generateDefinition(term: string, termEn: string): Promise<string> {
  const prompt = `다음 금속 처리 용어에 대해 기술적으로 간결하게 정의해줘.
용어: ${term}
영문: ${termEn}
조건: 비유나 잡설 없이, 2~3문장 이내의 정의 형식으로만 작성해줘.`;

  try {
    console.log('[ENV KEY]', process.env.OPENROUTER_API_KEY?.slice(0, 10), '...');
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'system', content: '너는 금속 용어를 한국어로 쉽게 설명하는 도우미야.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.choices?.[0]?.message?.content || '❗ 정의 응답이 비어 있습니다.';
  } catch (error: any) {
    console.error('🔴 GPT API 호출 실패:', error.message);
    if (error.response) {
      console.error('📦 응답 상태코드:', error.response.status);
      console.error('📄 응답 상세:', JSON.stringify(error.response.data, null, 2));
    }

    // 에러 유형에 따라 분기
    if (error.response?.status === 401) {
      return '❗ 인증 오류: API 키가 유효하지 않거나 누락되었습니다.';
    }
    if (error.response?.status === 429) {
      return '❗ 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    }
    if (error.response?.status === 500) {
      return '❗ 서버 오류로 인해 설명을 생성할 수 없습니다.';
    }

    return '❗ GPT로 설명을 생성하는 중 알 수 없는 오류가 발생했습니다.';
  }
}
