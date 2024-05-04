import fetcher from "~/utils";

export const getIlovepdfTocken = async () =>
  await fetcher("https://api.ilovepdf.com/v1/auth", {
    method: "POST",
    body: JSON.stringify({
      public_key:
        "project_public_01cc8a7ca79ae51e0581a4ee868beb03_4MNvs55130f5bb33943f49ce089da4c50f722",
    }),
  })
    .then((resp) => resp.json())
    .catch((err) => {
      console.error(err);
    });

export const getIlovepdfTockenAndResponse = async (req, res) => {
  await getIlovepdfTocken()
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      console.error(err);
    });
};
