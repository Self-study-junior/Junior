// 科目清單：ready 為 true 的會出現在首頁並可點進去；新增科目時在這裡加一筆
window.SUBJECTS = [
  { id: 'english', name: '英語', en: 'English', group: '語文', ready: true, mark: 'A',
    desc: '主題單字、一字多義、15 大文法主題與閱讀聽力策略，三版講義整併。' },
  { id: 'chinese', name: '國文', en: 'Chinese', group: '語文', ready: false, mark: '文' },
  { id: 'math', name: '數學', en: 'Math', group: '數學', ready: false, mark: '∑' },
  { id: 'biology', name: '生物', en: 'Biology', group: '自然', ready: true, mark: '生',
    desc: '從細胞到生態系：構造與功能、恆定、遺傳演化，附重要實驗整理。' },
  { id: 'physchem', name: '理化', en: 'Physics & Chemistry', group: '自然', ready: false, mark: '理' },
  { id: 'earth', name: '地科', en: 'Earth Science', group: '自然', ready: true, mark: '地',
    desc: '岩石與地貌、板塊運動、天文、大氣天氣與全球變遷。' },
  { id: 'history', name: '歷史', en: 'History', group: '社會', ready: true, mark: '史',
    desc: '臺灣史、中國與東亞史、世界史，附年代軸與史料判讀線索。' },
  { id: 'geography', name: '地理', en: 'Geography', group: '社會', ready: false, mark: '理' },
  { id: 'civics', name: '公民', en: 'Civics', group: '社會', ready: true, mark: '公',
    desc: '個人與社群、政治、法律、經濟四大篇，易混淆觀念一次釐清。' },
];
