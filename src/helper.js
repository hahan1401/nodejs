export const waitForAwhile = (time) => new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time ?? 0);
  });