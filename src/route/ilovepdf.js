import SignatureFile from "@ilovepdf/ilovepdf-js-core/tasks/sign/elements/SignatureFile";
import Signer from "@ilovepdf/ilovepdf-js-core/tasks/sign/receivers/Signer";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import dotenv from "dotenv";
import express from "express";
import {
  getIlovepdfTocken,
  getIlovepdfTockenAndResponse,
} from "~/services/ilovepdf";
import fetcher from "~/utils";

const DUMMY_PDF =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const SAMPLE_PDF = "https://pdfobject.com/pdf/sample.pdf";

const DUMMY_DOC =
  "https://test.cdn.one.fandelo.com/document/389cf6ce-f550-432f-ae99-037e2e8e2252/1b7f3c2c820a4b5dad58db067b23b4f2.doc";

dotenv.config();
export const ilovepdfRouter = express.Router();

ilovepdfRouter.post("/token", getIlovepdfTockenAndResponse);

ilovepdfRouter.post("/signature/send", async (req, res) => {
  const instance = new ILovePDFApi(
    process.env.ILOVEPDF_PUBLIC_KEY,
    process.env.ILOVEPDF_PRIVATE_KEY
  );

  const task = instance.newTask("sign");

  task
    .start()
    .then(() => {
      return task.addFile(DUMMY_PDF);
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
      const signer = new Signer("hahan+10", "hanvietha141@gmail.com");
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

ilovepdfRouter.get("/signature/list", async (req, res) => {
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

ilovepdfRouter.post("/download-original", async (req, res) => {
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

ilovepdfRouter.post("/download-signed", async (req, res) => {
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

ilovepdfRouter.post("/to-pdf", async (req, res) => {
  const instance = new ILovePDFApi(
    process.env.ILOVEPDF_PUBLIC_KEY,
    process.env.ILOVEPDF_PRIVATE_KEY
  );

  const task = instance.newTask("officepdf");

  task
    .start()
    .then(() => {
      return task.addFile(DUMMY_DOC); // .doc file
    })
    .then(() => {
      return task.process();
    })
    .then(() => {
      return task.download();
    })
    .then((resp) => {
      res.type("application/pdf");
      res.send(Buffer.from(resp));
    });
});

ilovepdfRouter.post("/water-mark", async (req, res) => {
  const instance = new ILovePDFApi(
    process.env.ILOVEPDF_PUBLIC_KEY,
    process.env.ILOVEPDF_PRIVATE_KEY
  );

  const task = instance.newTask("watermark");

  task
    .start()
    .then(() => {
      return task.addFile(DUMMY_PDF);
    })
    .then(() => {
      return task.process({ text: "myWatermarkText" });
    })
    .then(() => {
      return task.download();
    })
    .then((resp) => {
      res.type("application/pdf");
      res.send(Buffer.from(resp));
    });
});

ilovepdfRouter.post("/protect", async (req, res) => {
  const instance = new ILovePDFApi(
    process.env.ILOVEPDF_PUBLIC_KEY,
    process.env.ILOVEPDF_PRIVATE_KEY
  );

  const task = instance.newTask("protect");

  task
    .start()
    .then(() => {
      return task.addFile(DUMMY_PDF);
    })
    .then(() => {
      return task.process({ password: "test" });
    })
    .then(() => {
      return task.download();
    })
    .then((resp) => {
      res.type("application/pdf");
      res.send(Buffer.from(resp));
    });
});

ilovepdfRouter.post("/merge", async (req, res) => {
  const instance = new ILovePDFApi(
    process.env.ILOVEPDF_PUBLIC_KEY,
    process.env.ILOVEPDF_PRIVATE_KEY
  );

  const task = instance.newTask("merge");

  task
    .start()
    .then(() => {
      return task.addFile(DUMMY_PDF);
    })
    .then(() => {
      return task.addFile(SAMPLE_PDF);
    })
    .then(() => {
      return task.process({});
    })
    .then(() => {
      return task.download();
    })
    .then((resp) => {
      res.type("application/pdf");
      res.send(Buffer.from(resp));
    });
});
