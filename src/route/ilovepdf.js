import SignatureFile from "@ilovepdf/ilovepdf-js-core/tasks/sign/elements/SignatureFile";
import Signer from "@ilovepdf/ilovepdf-js-core/tasks/sign/receivers/Signer";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import express from "express";
import {
  getIlovepdfTocken,
  getIlovepdfTockenAndResponse,
} from "~/services/ilovepdf";
import fetcher from "~/utils";

export const ilovepdfRouter = express.Router();

ilovepdfRouter.post("/ilovepdf/token", getIlovepdfTockenAndResponse);

ilovepdfRouter.post("/ilovepdf/signature/send", async (req, res) => {
  const instance = new ILovePDFApi(
    "project_public_01cc8a7ca79ae51e0581a4ee868beb03_4MNvs55130f5bb33943f49ce089da4c50f722",
    "secret_key_a85681ca8ac387572696873553da4763_WuWXcae3e8b5e42020d84dda8a1321f1ee2b7"
  );

  const task = instance.newTask("sign");

  task
    .start()
    .then(() => {
      return task.addFile(
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      );
    })
    .then((file) => {
      const signatureFile = new SignatureFile(file, [
        {
          type: "signature",
          position: "300 -100",
          pages: "1",
          size: 28,
        },
      ]);

      return signatureFile;
    })
    .then((signatureFile) => {
      const signer = new Signer("hahan", "hanvietha141@gmail.com");
      signer.addFile(signatureFile);
      task.addReceiver(signer);
    })
    .then(() => {
      return task.process();
    })
    .then((response) => {
      res.json(response);
    });
});

ilovepdfRouter.get("/ilovepdf/signature/list", async (req, res) => {
  const token = await getIlovepdfTocken(req.body);

  await fetcher(
    "https://api.ilovepdf.com/v1/signature/list?page=0&per-page=100",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
  )
    .then((resp) => resp.json())
    .then((resp) => res.json(resp));
});

ilovepdfRouter.post("/ilovepdf/download-original", async (req, res) => {
  const token = await getIlovepdfTocken();
  const pdfResp = await fetcher(
    `https://api.ilovepdf.com/v1/signature/${req.body.tokenRequester}/download-original`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
  );

  res.type("application/pdf");
  pdfResp.arrayBuffer().then((buf) => {
    res.send(Buffer.from(buf));
  });
});

ilovepdfRouter.post("/ilovepdf/download-signed", async (req, res) => {
  const token = await getIlovepdfTocken();
  const pdfResp = await fetcher(
    `https://api.ilovepdf.com/v1/signature/${req.body.tokenRequester}/download-signed`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
  );

  res.type("application/pdf");
  pdfResp.arrayBuffer().then((buf) => {
    res.send(Buffer.from(buf));
  });
});
