// Собирает «API» сайта из scripts/products.mjs: npm run api
//   public/api/products.json       — список товаров (без отзывов, чтобы каталог грузился быстрее)
//   public/api/products/<id>.json  — один товар с отзывами
//   public/api/home.json           — отзывы зрителей для главной
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { products, testimonials } from './products.mjs'

const apiDir = new URL('../public/api/', import.meta.url)
const productsDir = new URL('products/', apiDir)

const toJson = (data) => `${JSON.stringify(data, null, 2)}\n`

// удаляем старые файлы, чтобы не остались товары, которых больше нет в каталоге
await rm(apiDir, { recursive: true, force: true })
await mkdir(productsDir, { recursive: true })

const list = products.map(({ reviews, ...product }) => ({ ...product, reviewsCount: product.reviewsCount ?? reviews.length }))
await writeFile(new URL('products.json', apiDir), toJson(list))

for (const product of products) {
  await writeFile(new URL(`${product.id}.json`, productsDir), toJson(product))
}

await writeFile(new URL('home.json', apiDir), toJson({ testimonials }))

console.log(`public/api: ${products.length} товаров, ${testimonials.length} отзыва о кинотеатре`)
