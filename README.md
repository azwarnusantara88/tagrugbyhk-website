# HKTR V5 — GitHub Setup + Google Sheets Sync Guide

Complete step-by-step guide to upload your website to GitHub and connect Google Sheets.

---

## 📦 WHAT'S IN YOUR ZIP

```
v5/
├── index.html              ← Your website (main file)
├── HKTR_LOGO.png           ← Logo
├── Men_action_shot_2.jpg   ← Action photos
├── Men_action_shot_3.jpg
├── Mixed_action_shot_1.jpg
├── Mixed_action_shot_2.jpg
├── Mixed_action_shot_3.jpg
├── Women_action_shot_1.jpg
├── ASIA_CUP_TEAM_PHOTO_1.jpg
├── ASIA_CUP_TEAM_PHOTO_2.jpg
├── ASIA_CUP_TEAM_PHOTO_3.jpg
├── mens-senior-card.jpg
├── CNAME                   ← Custom domain config
└── .github/workflows/
    └── deploy.yml          ← Auto-deploy on every push
```

---

## STEP 1: Delete Old Repo Files on GitHub

1. Go to https://github.com/azwarnusantara88/tagrugbyhk-website
2. Click **Settings** tab (top of page)
3. Scroll to the red **Danger Zone** box at the bottom
4. Click **"Delete this repository"**
5. Type: `azwarnusantara88/tagrugbyhk-website`
6. Click **"I understand the consequences, delete this repository"**

---

## STEP 2: Create Fresh Repo

1. Go to https://github.com/new
2. **Repository name:** `tagrugbyhk-website`
3. **Description:** `HKTR - Hong Kong Tag Rugby Official Website`
4. Select **Public**
5. **UNCHECK** all boxes:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click **"Create repository"**

Leave this page open.

---

## STEP 3: Upload V5 Files to GitHub

### Extract the ZIP on your computer:
- **Mac**: Double-click `hktr-v5-complete.zip`
- **Windows**: Right-click → "Extract All"

You'll get a folder named `v5` containing `index.html` and all images.

### Upload to GitHub:
1. On your new repo page, click **"Add file"** → **"Upload files"**
2. Open the extracted `v5` folder
3. **Select ALL files** (Ctrl+A / Cmd+A):
   - `index.html`
   - All `.jpg` and `.png` images
   - `CNAME` file
   - `.github/workflows/deploy.yml`
4. **Drag and drop** everything into GitHub's upload area
5. Wait for the file list to populate
6. Commit message: `HKTR V5 - Initial upload`
7. Select **"Commit directly to the main branch"**
8. Click **"Commit changes"**

---

## STEP 4: Enable GitHub Pages

1. In your repo, click **Settings** tab
2. Left sidebar → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Under **Branch**, select **"main"** and folder **"/(root)"**
5. Click **Save**

Wait 2-3 minutes, then visit: `https://azwarnusantara88.github.io/tagrugbyhk-website`

---

## STEP 5: Set Custom Domain (tagrugbyhk.org)

### On GitHub:
1. In **Settings → Pages**
2. Under **Custom domain**, type: `tagrugbyhk.org`
3. Click **Save**
4. After DNS check passes, check **"Enforce HTTPS"**

### At your domain registrar:
Add these DNS records:

| Type | Host/Name | Value/Points To |
|------|-----------|-----------------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | azwarnusantara88.github.io |

Wait 5-30 minutes, then visit: **https://tagrugbyhk.org**

---

## STEP 6: Make Google Sheet Public

1. Open your Google Sheet: `HKTR_Master_Content_Sheet`
   (URL: https://docs.google.com/spreadsheets/d/1VuyXe4v7BllPbvdXMoy7vI1qkgTqJn3PSVkr8M3VcPI)
2. Click **File → Share → Share with others**
3. Under "General access", change from **"Restricted"** to **"Anyone with the link"**
4. Set to **Viewer**
5. Click **Done**

---

## STEP 7: Deploy Google Apps Script (For Gallery Sync)

This connects your Google Drive photo folders to the website galleries.

### 7A. Create the Script
1. Go to **https://script.google.com**
2. Click **"New project"**
3. Delete the default `myFunction()` code
4. Copy the code below and paste it entirely:

```javascript
/**
 * HKTR Gallery Sync — Google Apps Script
 * Reads photos from Google Drive folders and returns JSON
 */

const GALLERY_FOLDERS = {
  "mens-open":   "1qWV_KxxLnF6uJojT9WMACQhHU4uKe54N",
  "mixed-open":  "1KlSJlILVX78NY0hawshCzflhf2RrMhqE",
  "mens-senior": "1mUNcImqzPJfBCD2fpwV8KGVZZUELKMF7"
};

function doGet(e) {
  const galleryKey = e.parameter.gallery || "all";
  try {
    let result = {};
    if (galleryKey === "all") {
      for (const [key, folderId] of Object.entries(GALLERY_FOLDERS)) {
        result[key] = listGalleryImages(folderId, key);
      }
    } else if (GALLERY_FOLDERS[galleryKey]) {
      result[galleryKey] = listGalleryImages(GALLERY_FOLDERS[galleryKey], galleryKey);
    } else {
      return jsonResponse({ error: "Invalid gallery key" });
    }
    result._timestamp = new Date().toISOString();
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function listGalleryImages(folderId, galleryKey) {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  const images = [];
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
  while (files.hasNext()) {
    const file = files.next();
    if (supportedTypes.includes(file.getMimeType().toLowerCase())) {
      const id = file.getId();
      images.push({
        id: id,
        name: file.getName(),
        src: "https://lh3.googleusercontent.com/d/" + id,
        thumbnail: "https://drive.google.com/thumbnail?id=" + id + "&sz=w400",
        alt: galleryKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) + " photo"
      });
    }
  }
  images.sort((a, b) => a.name.localeCompare(b.name));
  return {
    title: galleryKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: images.length,
    images: images
  };
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```

### 7B. Save and Deploy
1. Press **Ctrl+S** to save
2. Click **Deploy** (top right) → **New deployment**
3. Click the ⚙️ gear icon → choose **Web app**
4. Fill in:
   - Description: `HKTR Gallery API`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**
6. Google will ask for authorization → click through all prompts
7. **Copy the Web app URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`)

### 7C. Make Drive Folders Public
For each of your 3 gallery folders in Google Drive:
1. Right-click folder → **Share**
2. Change **"Restricted"** → **"Anyone with the link"**
3. Set to **Viewer**
4. Click **Done**

---

## STEP 8: Connect Google Sheets to Website

### Option A: Manual Content Updates (Simplest)
Edit your website text directly by modifying `index.html`:

1. On GitHub, go to your repo → click `index.html`
2. Click the **pencil icon** ✏️ (top right)
3. Edit any text (headlines, descriptions, etc.)
4. Scroll down → commit message → **"Commit changes"**
5. Site auto-deploys in ~2 minutes

### Option B: Google Sheet Sync (Advanced)
If you want the website to read from your Google Sheet automatically, you'd need to convert the static HTML to a dynamic setup (React/JS). This is more complex but possible if you want it later.

For now, **Option A (manual edits)** is the fastest and most reliable approach for V5.

---

## YOUR DAILY WORKFLOW

| You want to... | You do... |
|----------------|-----------|
| **Update text** | Edit `index.html` on GitHub → commit → auto-deploys |
| **Add gallery photos** | Upload to Google Drive folder → appears instantly (once Apps Script is connected) |
| **Change videos** | Edit YouTube embed URLs in `index.html` |
| **See changes live** | Visit https://tagrugbyhk.org |

---

## QUICK REFERENCE

| URL | Purpose |
|-----|---------|
| https://github.com/azwarnusantara88/tagrugbyhk-website | Your repo |
| https://tagrugbyhk.org | Live website |
| https://script.google.com | Google Apps Script editor |
| https://drive.google.com | Your photo folders |

---

## NEED HELP?

If anything goes wrong:
1. Check **Actions** tab on GitHub for error logs
2. Make sure the sheet/folders are set to "Anyone with the link"
3. Double-check the Web app URL is copied correctly
4. Ask me and I'll help debug!
