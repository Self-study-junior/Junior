# 國中自學筆記

國中會考重點筆記網站（只有筆記，不含題庫）。純靜態網頁，不需要任何建置工具，可直接用 GitHub Pages 發布。

目前科目：英語、生物、地科、歷史、公民。國文、數學、理化、地理整理中。

## 網站結構

```
index.html            首頁
<科目>/index.html      各科筆記頁（civics 公民、history 歷史、biology 生物、earth 地科、english 英語）
data/<科目>.js         各科筆記資料
data/summary.js        首頁用的各科統計（由 extract.mjs 自動產生）
assets/                樣式與程式（style.css、common.js、notes.js、english.js、home.js、subjects.js）
tools/extract.mjs      從「會考衝刺站」HTML 抽出筆記的工具
```

## 發布到 GitHub Pages

Settings → Pages → Build and deployment → Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`，存檔。
幾分鐘後網址會是 `https://self-study-junior.github.io/Junior/`。

## 更新或新增科目

1. 用整理好的「會考衝刺站」HTML 重新抽出筆記（題庫會自動略過）：

   ```
   node tools/extract.mjs 公民會考衝刺站.html civics
   ```

   加上 `--images` 會連講義附圖一起輸出到 `assets/img/<科目>/`。這些圖多半是出版社講義的掃描，公開的 repo 請先確認版權再加。

2. 新科目：在 `assets/subjects.js` 加一筆（或把 `ready` 改成 `true`），再複製一個現有科目的資料夾，把 `data-subject` 和 `data/<科目>.js` 改成新的科目代號。單元式科目用 `notes.js`；資料格式是單元陣列，每單元有 `unit`、`part`、`title`、`summary`、`sections`、`confusions`、`terms`，可選 `experiments`、`timeline`、`sources`。

## 本機預覽

```
python3 -m http.server
```

再打開 http://localhost:8000 。也可以直接雙擊 `index.html` 開啟。

---

筆記內容整理自南一《超會考》、康軒《勝經》與翰林《大滿貫》國中複習講義，僅供個人自學使用。
