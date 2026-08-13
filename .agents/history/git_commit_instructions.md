# Git Workflow & Commit Guide

**Date**: 2026-08-13
**Description**: Instructions for committing and pushing changes in a multi-repository workspace (Backend & Frontend).

---

## 1. Important Pre-requisite: `.gitignore` setup

Ensure `node_modules/` and `.env` are ignored in `expiry-date-express-server/.gitignore`:

```gitignore
node_modules/
.env
```

---

## 2. Commit & Push Backend (`expiry-date-express-server`)

Navigate to `d:\Projects\expiry-date-manager\expiry-date-express-server`:

1. Check repository status:
   ```bash
   git status
   ```

2. Stage all files:
   ```bash
   git add .
   ```

3. Commit changes:
   ```bash
   git commit -m "feat: setup project folder structure, express server on port 5001, and base dependencies"
   ```

4. Push to remote repository:
   ```bash
   git push origin main
   ```

---

## 3. Commit & Push Frontend (`expiry-date-manager-react-client`)

Navigate to `d:\Projects\expiry-date-manager\expiry-date-manager-react-client`:

1. Check repository status:
   ```bash
   git status
   ```

2. Stage all files:
   ```bash
   git add .
   ```

3. Commit changes:
   ```bash
   git commit -m "feat: initial react client setup"
   ```

4. Push to remote repository:
   ```bash
   git push origin main
   ```
