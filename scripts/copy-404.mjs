import { copyFileSync, existsSync } from "node:fs";

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html がありません");
  process.exit(1);
}

copyFileSync("dist/index.html", "dist/404.html");
console.log("dist/404.html を index.html から複製しました");
