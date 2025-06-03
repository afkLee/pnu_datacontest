type Token = {
  accessToken: string
}

export default () =>
  useState<Token>('token', () => ({
    accessToken: '',
  }))
