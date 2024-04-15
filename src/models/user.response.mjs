export default function responseJSON(
  success,
  message,
  data,
  error = undefined
) {
  if (!error)
    return {
      success,
      message,
      data,
    };
  else
    return {
      success,
      message,
      data,
      error,
    };
}
