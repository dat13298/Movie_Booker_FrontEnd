// utils/slugify.js
export const slugify = (str) =>
    str
        .toLowerCase()
        .normalize("NFD")                  // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")   // xóa dấu
        .replace(/[^a-z0-9]+/g, "-")       // ký tự khác -> -
        .replace(/(^-|-$)/g, "");          // bỏ - đầu/đuôi
