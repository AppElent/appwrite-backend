class IssueService {
  constructor() {
    this.issues = [{ id: 1, title: "Issue 1", description: "This is issue 1" }];
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
