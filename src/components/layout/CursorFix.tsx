"use client";

import { useEffect } from "react";

// 通过 JS 注入最高优先级 CSS — 绕开所有 CSS 层级问题
const CSS = `
*,*::before,*::after{cursor:default!important}
input,textarea,select,[contenteditable]{cursor:text!important}
a,button,[role="button"],[tabindex]:not([tabindex="-1"]){cursor:pointer!important}
`;

let injected = false;

export function CursorFix() {
  useEffect(() => {
    if (injected) return;
    injected = true;
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
  return null;
}
