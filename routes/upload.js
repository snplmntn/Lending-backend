const router = require("express").Router();
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { config } = require("firebase/remote-config");

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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const storageRef = ref(
      storage,
      `contracts/${req.body.name}/${req.file.originalname + "-" + uniqueSuffix}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    return res.status(200).json({
      DownloadURL: downloadURL,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
