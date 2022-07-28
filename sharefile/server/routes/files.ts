import express from "express";
import multer from "multer";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import File from "../model/File";
import https from "https";
import nodemailer from "nodemailer";
import createEmailTemplate from "../utils/createEmailTemplate";

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

router.post("/upload", upload.single("myFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload a file" });
    }

    const { originalname } = req.file;
    let format = originalname.split(".")[1];

    // console.log(req.file);

    let uploadedFile: UploadApiResponse | any;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "shareMe",
        resource_type: "auto",
        format,
      });
    } catch (error: any) {
      console.log(error.message);
      res.status(400).json({ message: "Cloudinary error" });
    }

    const { secure_url, bytes } = uploadedFile;
    console.log(uploadedFile);
    const file = await File.create({
      filename: originalname,
      sizeInBytes: bytes,
      secure_url,
      format,
    });

    res.status(201).json({
      id: file._id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file._id}`,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ msg: "File doesn't exist" });
    }

    const { filename, format, sizeInBytes } = file;

    return res.status(200).json({
      name: filename,
      sizeInBytes,
      format,
      id,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id/download", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ msg: "File doesn't exist" });
    }

    https.get(file.secure_url, (fileStream) => fileStream.pipe(res));
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/email", async (req, res) => {
  // validate request
  const { id, emailFrom, emailTo } = req.body;

  if (!id || !emailFrom || !emailTo) {
    return res.status(400).json({ msg: "Missing parameters" });
  }

  const file = await File.findById(id);

  if (!file) {
    return res.status(404).json({ msg: "File doesn't exist" });
  }

  //   create a transporter object to send email
  const transporter = {
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // prepare email data

  const { filename, sizeInBytes } = file;

  const fileSize = `${(Number(sizeInBytes) / (1024 * 1024)).toFixed(2)} MB`;

  const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${id}`;

  const mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: "File shared with you",
    text: `${emailFrom} shared a file with you`,
    // @ts-ignore
    html: createEmailTemplate(emailFrom, downloadPageLink, filename, fileSize),
  };

  // send email
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server error" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    await file.save();

    return res.status(200).json({ msg: "Email sent" });
  });
});

export default router;
