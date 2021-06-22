import { MyPromise } from "./MyPromise";

it.skip("should work for resolve case", async () => {
  const promise1 = await MyPromise((res) => res(3));
  expect(promise1).toBe(3);

  const promise2 = MyPromise((res) =>
    setTimeout(() => {
      res(10);
    }, 0)
  ).then((res) => res + 2);

  expect(await promise2).toBe(12);
});

it.skip("should work for reject case", async () => {
  try {
    await MyPromise((_, reject) => reject(3));
  } catch (error) {
    expect(error).toBe(3);
  }
});

it.skip("should work for error throw", () => {
  let message = "";

  MyPromise(() => {
    throw new Error("Oh no");
  }).catch((res) => {
    message = res.message;
  });

  expect(message).toBe("Oh no");
});

it.skip("should work for Promise.resolve", async () => {
  const promise1 = MyPromise.resolve(3);
  expect(await promise1).toBe(3);
});

it.skip("should work for Promise.reject", async () => {
  try {
    await MyPromise.reject(3);
  } catch (error) {
    expect(error).toBe(3);
  }
});

it.skip("should work for Promise.race", async () => {
  const promise1 = MyPromise((res) =>
    setTimeout(() => {
      res(10);
    }, 100)
  );

  const promise2 = MyPromise((res) =>
    setTimeout(() => {
      res(20);
    }, 50)
  );

  const data = await MyPromise.race([promise1, promise2]);
  expect(data).toBe(20);
});

it.skip("should work for Promise.all", async () => {
  const promise1 = MyPromise((res) =>
    setTimeout(() => {
      res(10);
    }, 100)
  );

  const promise2 = MyPromise((res) =>
    setTimeout(() => {
      res(20);
    }, 100)
  );

  const data = await MyPromise.all([promise1, promise2]);
  expect(data).toEqual([10, 20]);
});

it.skip("should work for Promise.finally", async () => {
  let messageFinally = "";
  await MyPromise((res) => res(10)).finally(() => {
    messageFinally = "finally";
  });
  expect(messageFinally).toBe("finally");
});

it.skip("should work for Promise.allSettled", async () => {
  const promise1 = MyPromise.resolve(3);
  const promise2 = MyPromise((_, reject) => setTimeout(reject, 100, "foo"));
  const promises = [promise1, promise2];

  const data = await MyPromise.allSettled(promises);

  expect(data).toEqual([
    { status: "fulfilled", value: 3 },
    { status: "rejected", reason: "foo" },
  ]);
});
