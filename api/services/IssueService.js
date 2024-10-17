class IssueService {
  constructor() {
    this.issues = [];
  }

  createIssue(issue) {
    this.issues.push(issue);
  }

  getIssues() {
    return this.issues;
  }

  getIssue(id) {
    return this.issues.find((issue) => issue.id === id);
  }
}

export default IssueService;
