// // src/utils/sessionHelpers.ts
// import CryptoJS from "crypto-js";
// // import {  } from "@/types/types";
// // import { PurchaseOrder } from "@prisma/client";
// import { FullPurchaseOrderRedux } from "@/types";
// import { CartItem } from "@/store/orderSlice";
// // نوع داده رمزگشایی‌شده که با ساختار واقعی همخوانی دارد
// interface DecryptedOrderShop {
//   items: CartItem[];
//   totalPrice?: number; // اختیاری، در صورت وجود در آینده
//   OpenCart?: boolean; // اختیاری، در صورت وجود در آینده
//   accessCart?: boolean; // اختیاری، در صورت وجود در آینده
// }

// // می‌خوای من همین الان برات کدی بنویسم که sessionStorage توی مرورگر ذخیره کنه، بعدش با fetch به این API بده و اونجا رمزگشایی بشه؟
// const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

// if (!secretKey) {
//   throw new Error(
//     "متغیر محیطی CRYPTO_SECRET_KEY تعریف نشده است. لطفاً آن را در فایل .env.local تنظیم کنید."
//   );
// }

// export function getDecryptedOrderShop(): DecryptedOrderShop {
//   try {
//     if (typeof window === "undefined") return { items: [] };

//     const encryptedPersistedState = sessionStorage.getItem("persist:root");
//     if (!encryptedPersistedState) return { items: [] };

//     const parsed = JSON.parse(encryptedPersistedState);
//     if (!parsed.orderShop) return { items: [] };


//     const encryptedOrderShop = JSON.parse(parsed.orderShop); // 👈 این قسمت مهمه چون دوبار stringify شده

//     const bytes = CryptoJS.AES.decrypt(encryptedOrderShop, secretKey!);
//     const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

//     if (!decryptedText) {
//       console.warn("🔐 رمزگشایی موفق نبود. خروجی خالی است.");
//       return { items: [] };
//     }

//     const decryptedObject: DecryptedOrderShop = JSON.parse(decryptedText);
//     return decryptedObject || { items: [] };

//   } catch (error) {
//     console.error("خطا در رمزگشایی persisted state:", error);
//     // اگر خطا از نوع Malformed UTF-8 باشد، احتمالاً به دلیل تغییر کلید است
//     if (error instanceof Error && error.message.includes("Malformed UTF-8")) {
//       console.error("این خطا ممکن است به دلیل وجود داده‌های قدیمی رمزگذاری شده با کلید قبلی باشد. Session Storage را پاک کنید.");
//     }
//     return { items: [] };
//   }
// }


// src/utils/sessionHelpers.ts
import CryptoJS from "crypto-js";
import { CartItem } from "@/store/orderSlice";

interface DecryptedOrderShop {
  items: CartItem[];
  totalPrice?: number;
  OpenCart?: boolean;
  accessCart?: boolean;
}

const secretKey =
  process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY ?? "secretkey2338wfef";

export function getDecryptedOrderShop(): DecryptedOrderShop {
  if (typeof window === "undefined") return { items: [] };

  try {
    const persisted = sessionStorage.getItem("persist:root");
    if (!persisted) return { items: [] };

    const parsed = JSON.parse(persisted);
    if (!parsed.orderShop) return { items: [] };

    // مرحله 1: لایه اول stringify رو حذف کنیم
    const encryptedOrderShop = JSON.parse(parsed.orderShop);

    // مرحله 2: رمزگشایی واقعی
    const bytes = CryptoJS.AES.decrypt(encryptedOrderShop, secretKey!);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) return { items: [] };

    const decryptedObject: DecryptedOrderShop = JSON.parse(decryptedText);
    return decryptedObject || { items: [] };
  } catch (error) {
    console.error("❌ خطا در رمزگشایی persisted state:", error);
    return { items: [] };
  }
}



// src/utils/sessionHelpers.ts
export function debugPersist() {
  if (typeof window === "undefined") {
    console.warn("❌ این تابع فقط سمت مرورگر قابل اجراست.");
    return;
  }

  const persisted = sessionStorage.getItem("persist:root");
  if (!persisted) {
    console.warn("⚠️ هیچ داده‌ای در persist:root پیدا نشد.");
    return;
  }

  try {
    const parsed = JSON.parse(persisted);
    console.group("🗂️ Debug Persist Storage");
    console.log("🔑 کل persist:root:", parsed);

    if (parsed.orderShop) {
      console.log("🛒 مقدار orderShop (خام):", parsed.orderShop);
      try {
        const tryParse = JSON.parse(parsed.orderShop);
        console.log("✅ مقدار orderShop بعد از JSON.parse:", tryParse);
      } catch {
        console.warn("⚠️ orderShop قابل JSON.parse نیست (احتمالا رمزگذاری شده).");
      }
    } else {
      console.warn("⚠️ کلید orderShop وجود ندارد.");
    }

    console.groupEnd();
  } catch (err) {
    console.error("❌ خطا در parse کردن persist:root:", err);
  }
}
