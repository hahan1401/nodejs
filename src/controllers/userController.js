import multer from 'multer';
import path from 'path';
import { UserModel } from '~/models/user.model';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: imageFilter });

export const handleUploadFile = async (req, res) => {
  if (!req.file) {
    return res.send('Please select an image to upload');
  }

  UserModel.updateOne(
    { name: 'talent name 1' },
    {
      $set: { avartar: `http://localhost:5151/uploads/${req.file.filename}` },
    }
  );
  res.json({
    responseData: `http://localhost:5151/uploads/${req.file.filename}`,
  });
  // });
};

export const updateUserHandler = async (req, res) => {
  console.log('edit user on server');
  const userId = req.params.id;
  UserModel.updateOne({ userId: userId }, { $set: { name: req.body.name } });
  const user = await UserModel.findOne({ userId: userId });
  res.json(user);
};

export const addNewUserHandler = async (req, res) => {
  const total = await UserModel.find({}).toArray();
  const length = total?.length;
  await UserModel.insertOne({name: req.body.name, userId: (length+1).toString()})
  const users = UserModel.find({}).toArray();
  res.send(users)
};
