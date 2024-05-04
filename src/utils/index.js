const fetcher = async (input, init) => {
  const _init = {
    credentials: "same-origin",
    ...init,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  };

  return fetch(input, _init).then((res) => {
    return res;
  });
};

export default fetcher;
