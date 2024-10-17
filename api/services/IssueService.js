import { Client, Databases, ID } from "appwrite";

class IssueService {
  constructor(endpoint, projectId) {
    this.issues = [{ id: 1, title: "Issue 1", description: "This is issue 1" }];
    this.client = new Client().setEndpoint(endpoint).setProject(projectId);
  }

  createIssue(issue) {
    this.issues.push(issue);
  }

  getIssues() {
    return this.issues;
  }

  getIssue(id) {
    const issue = this.issues.find((issue) => issue.id === parseInt(id));
    return issue || {};
  }
}

export default IssueService;
