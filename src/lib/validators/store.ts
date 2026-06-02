// 店铺表单验证 (Zod)

import { z } from "zod";

export const storeCreateSchema = z.object({
  name: z
    .string()
    .min(1, "请输入店铺名称")
    .max(50, "店铺名称最多50个字符"),
  description: z.string().max(500, "描述最多500个字符").optional(),
  category: z.string().optional(),
  address: z.string().max(200, "地址最多200个字符").optional(),
  mapLinks: z
    .array(
      z.object({
        provider: z.enum(["AMAP", "BAIDU", "TENCENT"]),
        url: z.string().url("请输入有效的地图链接"),
      })
    )
    .optional(),
});

export const storeUpdateSchema = storeCreateSchema.partial();

export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;
