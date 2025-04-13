import { z } from 'zod'

export const Advert = z.object({
  disclaimer: z.string(),
  info_link: z.string().url().nullable()
})

export const AdditionalIcon = z.object({
  type: z.string(),
  url: z.string().url()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AdditionalIcon = z.infer<typeof AdditionalIcon>

export const Category = z.object({
  id: z.string(),
  name: z.string(),
  advert: Advert.nullable(),
  image_link: z.string().url(),
  gradient_start: z.string(),
  gradient_end: z.string(),
  title_color: z.string(),
  additional_icons: z.array(AdditionalIcon)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Category = z.infer<typeof Category>

export const Section = z.object({
  id: z.string(),
  name: z.string(),
  additional_icons: z.array(AdditionalIcon),
  categories: z.array(Category)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Section = z.infer<typeof Section>

export const Catalog = z.array(Section)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Catalog = z.infer<typeof Catalog>
