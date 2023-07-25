const router = require("express").Router();
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCxHOuR3KjXMhsmz3qSj3RPsierPr66wDI",
  authDomain: "lending-app-cf35e.firebaseapp.com",
  databaseURL: "https://lending-app-cf35e-default-rtdb.firebaseio.com",
  projectId: "lending-app-cf35e",
  storageBucket: "lending-app-cf35e.appspot.com",
  messagingSenderId: "685025318350",
  appId: "1:685025318350:web:f3bc8ee74b747a0c4b479f",
  measurementId: "G-FCDVWT73SG",
};

initializeApp(firebaseConfig);
const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const storageRef1 = ref(
        storage,
        `contracts/${req.body.name}/${req.files["file1"][0].originalname}-${uniqueSuffix}`
      );

      const storageRef2 = ref(
        storage,
        `contracts/${req.body.name}/${req.files["file2"][0].originalname}-${uniqueSuffix}`
      );

      const metadata1 = {
        contentType: req.files["file1"][0].mimetype,
      };

      const metadata2 = {
        contentType: req.files["file2"][0].mimetype,
      };

      const snapshot1 = await uploadBytesResumable(
        storageRef1,
        req.files["file1"][0].buffer,
        metadata1
      );

      const snapshot2 = await uploadBytesResumable(
        storageRef2,
        req.files["file2"][0].buffer,
        metadata2
      );

      const downloadURL1 = await getDownloadURL(snapshot1.ref);
      const downloadURL2 = await getDownloadURL(snapshot2.ref);

      return res.status(200).json({
        letterURL: downloadURL1,
        proofURL: downloadURL2,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
