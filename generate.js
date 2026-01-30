const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const IMAGE_REGEX = /\.(jpg|jpeg|png|webp)$/i;

// ⚙️ CẤU HÌNH: Thêm các truyện mới vào danh sách này
const STORIES = [
  {
    folderName: "linh-khe",          // Tên thư mục chứa ảnh
    outputFile: "data.json",         // Tên file json muốn xuất ra
    name: "Linh Khế"                 // Tên hiển thị (để log cho đẹp)
  },
  {
    folderName: "lac-nguyet-son-ha",
    outputFile: "data-lnsh.json",
    name: "Lạc Nguyệt Sơn Hà"
  }
  // Muốn thêm truyện khác thì copy block trên paste xuống đây
];

function generateStoryData(config) {
  const { folderName, outputFile, name } = config;
  const storyDir = path.join(ROOT, folderName);
  const outputPath = path.join(ROOT, outputFile);

  console.log(`\n🚀 Đang xử lý: ${name} (${folderName})...`);

  // Kiểm tra thư mục có tồn tại không
  if (!fs.existsSync(storyDir)) {
    console.warn(`⚠️  Cảnh báo: Không tìm thấy thư mục "${folderName}". Bỏ qua.`);
    return;
  }

  // Lấy danh sách folder chap-x
  const chapters = fs.readdirSync(storyDir)
    .filter(fileName => {
      const fullPath = path.join(storyDir, fileName);
      return fs.statSync(fullPath).isDirectory() && /^chap-\d+$/.test(fileName);
    })
    .sort((a, b) => {
      return (
        parseInt(a.replace("chap-", "")) -
        parseInt(b.replace("chap-", ""))
      );
    });

  // Tạo data
  const data = chapters.map(chapterFolder => {
    const chapNum = parseInt(chapterFolder.replace("chap-", ""));
    const chapterPath = path.join(storyDir, chapterFolder);
    
    // Đếm file ảnh
    const files = fs.readdirSync(chapterPath)
      .filter(f => IMAGE_REGEX.test(f));

    return {
      id: chapNum,
      title: `Chương ${chapNum}`,
      updatedAt: new Date().toLocaleDateString("vi-VN"),
      folder: `${folderName}/${chapterFolder}`,
      totalImages: files.length
    };
  });

  // Ghi file
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ Đã cập nhật ${outputFile}`);
  console.log(`📚 Tổng chương: ${data.length}`);
}

// ▶️ CHẠY SCRIPT
console.log("--- BẮT ĐẦU CẬP NHẬT DỮ LIỆU ---");
STORIES.forEach(story => generateStoryData(story));
console.log("\n--- HOÀN TẤT ---");
