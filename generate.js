const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const STORY_DIR = path.join(ROOT, "linh-khe");
const OUTPUT = path.join(ROOT, "data.json");
const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)$/i;

// Lấy các folder chap-x
const chapters = fs.readdirSync(STORY_DIR)
  .filter(name => {
    const full = path.join(STORY_DIR, name);
    return fs.statSync(full).isDirectory() && /^chap-\d+$/.test(name);
  })
  .sort((a, b) => {
    return (
      parseInt(a.replace("chap-", "")) -
      parseInt(b.replace("chap-", ""))
    );
  });

const data = chapters.map(folder => {
  const chapNum = parseInt(folder.replace("chap-", ""));
  const files = fs.readdirSync(path.join(STORY_DIR, folder))
    .filter(f => IMAGE_REGEX.test(f));

  return {
    id: chapNum,
    title: `Chương ${chapNum}`,
    updatedAt: new Date().toLocaleDateString("vi-VN"),
    folder: `linh-khe/${folder}`,
    totalImages: files.length
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), "utf8");

console.log("✅ Đã cập nhật data.json");
console.log("📚 Tổng chương:", data.length);
