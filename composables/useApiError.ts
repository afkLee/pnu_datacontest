type ApiError = {
  isError: boolean
  message: string
}

export default () =>
  useState<ApiError>('api-error', () => ({
    isError: false,
    message: '',
  }))
