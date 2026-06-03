"use client";

import { useEffect } from "react";

export function CursorFix() {
  useEffect(() => {
    // 注入最高优先级 style 标签
    const style = document.createElement("style");
    style.id = "cursor-fix";
    style.textContent = "*,*::before,*::after{cursor:default!important}input,textarea,select,[contenteditable]{cursor:text!important}a,button,[role=button]{cursor:pointer!important}";
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById("cursor-fix");
      if (el) el.remove();
    };
  }, []);
  return null;
}
