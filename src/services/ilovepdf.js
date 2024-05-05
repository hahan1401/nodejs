import dotenv from "dotenv";
import fetcher from "~/utils";

dotenv.config();
export const getIlovepdfTocken = async () =>
  await fetcher("https://api.ilovepdf.com/v1/auth", {
    method: "POST",
    body: JSON.stringify({
      public_key: process.env.ILOVEPDF_PUBLIC_KEY,
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
