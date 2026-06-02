// 地图 URL Scheme 构建

/**
 * 构建高德地图跳转链接
 * 移动端: https://uri.amap.com/marker?position=lon,lat&name=xxx
 * PWA/Web: https://ditu.amap.com/place/xxx
 */
export function buildAmapUrl(
  name: string,
  longitude: number,
  latitude: number
): string {
  return `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(name)}`;
}

/**
 * 构建百度地图跳转链接
 */
export function buildBaiduUrl(
  name: string,
  longitude: number,
  latitude: number
): string {
  return `https://api.map.baidu.com/marker?location=${latitude},${longitude}&title=${encodeURIComponent(name)}&content=${encodeURIComponent(name)}&output=html`;
}

/**
 * 构建腾讯地图跳转链接
 */
export function buildTencentUrl(
  name: string,
  longitude: number,
  latitude: number
): string {
  return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};title:${encodeURIComponent(name)}`;
}

/**
 * 检测当前设备类型
 */
export function detectDevice(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

/**
 * 检测是否为微信内置浏览器
 */
export function isWechatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /micromessenger/.test(navigator.userAgent.toLowerCase());
}
