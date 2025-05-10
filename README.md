# **Point Blank - Official Website** [![Netlify Status](https://api.netlify.com/api/v1/badges/78bf83ca-927b-470d-a103-b7a66a680ce9/deploy-status)](https://app.netlify.com/sites/pbpage/deploys) 

Welcome to the **Point Blank** official website repository! This project serves as the landing page for Point Blank, showcasing our achievements, initiatives, and much more.

---

## **Quick Links**  
- **Previous Website**: [GitHub](https://github.com/pbdsce/landing-page) | [Live Landing Page](https://www.pointblank.club/)  
- **Issues to Get Started**: [GitHub Issues](https://github.com/pbdsce/pbwebsite/issues)
- **Staging Branch Deploy** : [Staging Deployment](https://staging--pbpage.netlify.app/)
---

## **Getting Started**  

Follow the steps below to set up the project locally:  

### **1. Clone the Repository**  
```bash
git clone https://github.com/pbdsce/pbwebsite.git
cd pbwebsite
```

### **2. Install Dependencies**  
Install all required dependencies using your preferred package manager:  
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### **3. Install Infisical CLI**  
Follow the instructions in the [Infisical CLI documentation](https://infisical.com/docs/cli/overview)
 to install the CLI on your machine. 


The application will be accessible at [http://localhost:3000](http://localhost:3000).  

### **4. Login and Initialize Infisical** 
1. Navigate to the repository in your terminal.
2. Run the following command to log in:
```bash
infisical login
```
**Note** : contact one of the maintainers to obtain the infisical credentials.

### **5. Use infisical run -- as a Prefix for Commands** 
When running commands, prepend them with `infisical run --`.

For example, instead of running:
```bash
npm run dev
```
Use:
```bash
infisical run -- npm run dev
```
#### Tip: To simplify this process, you can create aliases for commonly used commands. 
---

## **Contributing**  

1. Fork this repository.  
2. Create a new branch for your feature or bug fix:  
   ```bash
   git checkout -b feature/<feature-name>
   ```
3.  Stage the files for commit:
    ```bash
    git add <file_name>  # Or use "git add ." to stage all changes
    ``` 
4. Make your changes and commit them:  
   ```bash
   git commit -m "Add feature: <feature-description>"
   ```
4. Push your branch and submit a Pull Request to the ***staging*** repository:  
   ```bash
   git push origin feature/<feature-name>
   ```  

Check the [Issues](https://github.com/pbdsce/pbwebsite/issues) page for tasks you can pick up!  


## ✅ Automated Pull Request Checks

This repository uses GitHub Actions to enforce code hygiene and PR size tracking.

### 🔹 PR Size Labels
PRs are automatically labeled based on the number of added/changed lines:

| Label | Lines of Code |
|-------|----------------|
| XS    | 0–9            |
| S     | 10–49          |
| M     | 50–199         |
| L     | 200–499        |
| XL    | 500+           |

### 🔹 Merge Commit Check
To avoid polluting the Git history, PRs are scanned for **merge commits**. If found, the workflow will fail.

✅ **Use this instead of merging**:
- `git pull --rebase`
- `git rebase main` before pushing

### 🔹 Git Fetch Depth
The `checkout` step uses `fetch-depth: 0` to fetch the full commit history.  
This is required for merge commit checks to work properly.


---

## **GitHub Bot Commands**

Use these commands in comments on issues and pull requests to perform common tasks:

### **Issue Command Bot (for GitHub Issues)**
- `/assign [@username]` - Assigns the issue to yourself or a specified user
- `/close` - Closes the issue
- `/reopen` - Reopens the issue
- `/label [label-name]` - Adds a custom label to the issue
- `/help` - Adds the "help wanted" label to the issue
- `/needs-triage` - Adds the "needs-triage" label to the issue
- `/lgtm` - Adds the "LGTM" (Looks Good To Me) label to the issue (cannot be used by issue author)
- `/cc @user1 @user2` - Mentions specified users in the issue to bring it to their attention

### **PR Command Bot (for Pull Requests)**
- `/assign [@username]` - Requests review from yourself or a specified user
- `/close` - Closes the pull request
- `/reopen` - Reopens the pull request
- `/label [label-name]` - Adds a custom label to the pull request
- `/help` - Adds the "help wanted" label to the pull request
- `/needs-triage` - Adds the "needs-triage" label to the pull request
- `/lgtm` - Adds the "LGTM" (Looks Good To Me) label to approve the PR (cannot be used by PR author)
- `/cc @user1 @user2` - Requests reviews from specified users

Additionally, the PR Command Bot automatically processes:
- `/kind:[type]` or `/kind [type]` in PR descriptions to add kind labels (e.g., kind/bug, kind/feature)

---

## **Contact**  
If you have any questions or need assistance, feel free to reach out to the maintainers.  

Let's build something amazing! 🚀
