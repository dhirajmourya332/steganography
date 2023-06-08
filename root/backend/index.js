const cluster = require("cluster");
const os = require("os");

const cpuNUms = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNUms; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const process = require("process");
  const path = require("path");
  const os = require("os");
  const cors = require("cors");
  const express = require("express");
  const mime = require("mime");

  const app = express();

  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage: storage });

  //server static files
  app.use(express.static("./public"));
  app.use(express.static(os.tmpdir()));

  //cors

  app.use(cors());

  //llsb steg
  const encode_llsb = require("./steg/llsb/encode");
  const decode_llsb = require("./steg/llsb/decode");
  //rlsb
  const encode_rlsb = require("./steg/rlsb/encode");
  const decode_rlsb = require("./steg/rlsb/decode");

  //api to encode message in image using LSB
  app.post(
    "/api/steg/llsb/encode",
    upload.single("coverFile"),
    async function (req, res) {
      try {
        const supported_file_type = ["jpg", "jpeg", "png"];
        const file_extension = mime.getExtension(
          mime.getType(`${os.tmpdir()}/${req.file.originalname}`)
        );
        if (!supported_file_type.includes(file_extension)) {
          console.log("wrong file type");
          res.send(
            JSON.stringify({ success: false, error: "Wrong file type!" })
          );
          return;
        }

        const em = await encode_llsb(
          `${os.tmpdir()}/${req.file.originalname}`,
          req.body.message,
          req.body.stegoKey,
          `${os.tmpdir()}/${path.basename(
            req.file.originalname,
            path.extname(req.file.originalname)
          )}.png`
        );
        if (em.success) {
          res.end(
            JSON.stringify({
              success: true,
              coverFilePath: `/${req.file.originalname}`,
              stegoFilePath: `/${path.basename(
                req.file.originalname,
                path.extname(req.file.originalname)
              )}.png`,
            })
          );
        } else {
          res.end(JSON.stringify({ success: false }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  //api to extract message from image using LSB
  app.post(
    "/api/steg/llsb/decode",
    upload.single("stegoFile"),
    async function (req, res) {
      try {
        const dm = await decode_llsb(
          `${os.tmpdir()}/${req.file.originalname}`,
          req.body.stegoKey
        );
        res.end(JSON.stringify(dm));
      } catch (error) {
        console.log(error);
      }
    }
  );

  //dhi steg
  //api to embed message in image using dhi version
  app.post(
    "/api/steg/rlsb/encode",
    upload.single("coverFile"),
    async function (req, res) {
      try {
        const em = await encode_rlsb(
          `${os.tmpdir()}/${req.file.originalname}`,
          req.body.message,
          req.body.stegoKey,
          `${os.tmpdir()}/${path.basename(
            req.file.originalname,
            path.extname(req.file.originalname)
          )}.png`
        );
        if (em.success) {
          res.end(
            JSON.stringify({
              success: true,
              coverFilePath: `/${req.file.originalname}`,
              stegoFilePath: `/${path.basename(
                req.file.originalname,
                path.extname(req.file.originalname)
              )}.png`,
            })
          );
        } else {
          res.end(JSON.stringify({ success: false }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  //api to extract message from image using dhi_version
  app.post(
    "/api/steg/rlsb/decode",
    upload.single("stegoFile"),
    async function (req, res) {
      try {
        const dm = await decode_rlsb(
          `${os.tmpdir()}/${req.file.originalname}`,
          req.body.stegoKey
        );
        res.end(JSON.stringify(dm));
      } catch (error) {
        console.log(error);
      }
    }
  );
  app.get("/cronjob/", (req, res) => {
    res.end(JSON.stringify({ success: true }));
  });

  app.listen(process.env.PORT | 5000, () => {
    console.log(new Date() + ": server listning at port 5000...");
  });
}
