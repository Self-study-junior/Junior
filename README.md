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

筆記內容整理自南一《超會考》、康軒《勝經》與翰林《大滿貫》國中複習講義，僅供個人自學使用。
