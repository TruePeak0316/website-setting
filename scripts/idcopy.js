function copyLineID() {
  const text = "@lua6791g";
  navigator.clipboard.writeText(text).then(() => {
    alert("LINE ID 已複製！");
  }).catch(err => {
    alert("複製失敗，請手動複製。");
    console.error(err);
  });
}