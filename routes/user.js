import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

const getUser = (req, res) => {
  const username = req.params?.username;
  res.json({ user: username });
};

router.get("/:username", getUser);

export default router;
