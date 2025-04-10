import { z } from 'zod'

const FilterRange = z.object({
  name: z.string(),
  field_name: z.string(),
  filter_type: z.literal('range'),
  list_values: z.null(),
  range_min_val: z.string(),
  range_max_val: z.string()
})

const FilterListValues = z.object({
  all: z.array(z.string()),
  actual: z.null()
})

const FilterList = z.object({
  name: z.string(),
  field_name: z.string(),
  filter_type: z.literal('list'),
  list_values: FilterListValues,
  range_min_val: z.null(),
  range_max_val: z.null()
})

const FilterToggle = z.object({
  name: z.string(),
  field_name: z.string(),
  filter_type: z.literal('toggle'),
  list_values: FilterListValues,
  range_min_val: z.null(),
  range_max_val: z.null()
})

export const Filter = z.discriminatedUnion('filter_type', [FilterRange, FilterList, FilterToggle])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Filter = z.infer<typeof Filter>

// Product schemas
const ImageLinks = z.object({
  small: z.array(z.string().url()),
  normal: z.array(z.string().url())
})

const Rating = z.object({
  rating_average: z.number(),
  rates_count: z.number()
})

const Prices = z.object({
  regular: z.string(),
  discount: z.string().nullable(),
  cpd_promo_price: z.string().nullable()
})

const Label = z.object({
  label: z.string(),
  bg_color: z.string(),
  text_color: z.string()
})

export const Product = z.object({
  plu: z.number(),
  name: z.string(),
  image_links: ImageLinks,
  uom: z.string(),
  step: z.string(),
  rating: Rating.nullable(),
  promo: z.object({}).nullable(),
  prices: Prices,
  labels: z.array(Label).nullable(),
  property_clarification: z.string(),
  has_age_restriction: z.boolean(),
  stock_limit: z.string(),
  badges: z.array(z.any())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Product = z.infer<typeof Product>

export const ProductCategory = z.object({
  parent_id: z.string(),
  name: z.string(),
  filters: z.array(Filter),
  products: z.array(Product)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProductCategory = z.infer<typeof ProductCategory>

const PriceItem = z.object({
  value: z.string(),
  placement_type: z.string()
})

const Nutrient = z.object({
  value: z.string(),
  text: z.string()
})

const Attribute = z.object({
  name: z.string(),
  value: z.string(),
  uom: z.string().nullable()
})

export const DetailedProduct = z.object({
  plu: z.number(),
  name: z.string(),
  image_links: ImageLinks,
  uom: z.string(),
  step: z.string(),
  rating: Rating,
  promo: z.null(),
  prices: z.array(PriceItem), // Updated to match the new structure
  labels: z.array(Label).nullable(),
  property_clarification: z.string(),
  has_age_restriction: z.boolean(),
  stock_limit: z.string(),
  description: z.string().nullable(),
  description_md: z.string().nullable(),
  description_html: z.string().nullable(),
  nutrients: z.array(Nutrient).nullable(),
  attributes: z.array(Attribute),
  ingredients: z.string().nullable(),
  ingredients_html: z.string().nullable(),
  is_available: z.boolean(),
  is_various_manufacturers: z.boolean(),
  badges: z.array(z.any())
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DetailedProduct = z.infer<typeof DetailedProduct>
