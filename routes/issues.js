import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

import IssueService from "../services/IssueService.js";

const getIssues = (req, res) => {
  const id = req.params?.id;
  if (id) {
    res.json(new IssueService().getIssue(id));
  } else {
    res.json(new IssueService().getIssues());
  }
};

const postIssue = (req, res) => {
  const issue = req.body;
  new IssueService().createIssue(issue);
  res.json({ issue });
};

router.get("/:id", getIssues);
router.get("/", getIssues);
router.post("/", postIssue);

export default router;
