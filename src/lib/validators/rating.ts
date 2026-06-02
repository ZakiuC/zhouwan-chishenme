// 评分表单验证 (Zod)

import { z } from "zod";

export const ratingSchema = z
  .object({
    wantScore: z.number().int().min(1, "至少1颗星").max(5, "最多5颗星"),
    triedRating: z.enum([
      "STRONGLY_RECOMMEND",
      "RECOMMEND",
      "NEUTRAL",
      "NOT_RECOMMEND",
      "NOT_TRIED",
    ]),
    tasteScore: z.number().int().min(1).max(5).nullable().optional(),
    valueScore: z.number().int().min(1).max(5).nullable().optional(),
    ambienceScore: z.number().int().min(1).max(5).nullable().optional(),
    speedScore: z.number().int().min(1).max(5).nullable().optional(),
    comment: z.string().max(300, "评论最多300个字符").optional(),
  })
  .refine(
    (data) => {
      // 如果吃过（非 NOT_TRIED），后四个维度必填
      if (data.triedRating !== "NOT_TRIED") {
        return (
          data.tasteScore != null &&
          data.valueScore != null &&
          data.ambienceScore != null &&
          data.speedScore != null
        );
      }
      return true;
    },
    {
      message: "吃过的话请完成所有评分维度",
      path: ["triedRating"],
    }
  );

export type RatingInput = z.infer<typeof ratingSchema>;
