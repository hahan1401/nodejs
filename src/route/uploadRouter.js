import express from 'express';
import { handleUploadFile, upload } from '~/controllers/userController';

export const uploadRouter = express.Router();


uploadRouter.post('/upload', upload.single('file'), handleUploadFile);