import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: rule => rule.required().positive(),
    }),
    // Single picture field
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      validation: rule => rule.required().error('A product picture is required.'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Product color (e.g., Red, Blue, Green, Black, White)',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'Product size (e.g., S, M, L, XL, One Size)',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'Is New',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      color: 'color',
      size: 'size',
      media: 'picture', // Use the single picture for preview
    },
    prepare(selection: { title: string; price?: number; color?: string; size?: string; media?: any }) {
      const { title, price, color, size, media } = selection
      const variant = [color, size].filter(Boolean).join(' - ')
      return {
        title: title,
        subtitle: `${price ? `Rs ${price}` : 'No price set'}${variant ? ` | ${variant}` : ''}`,
        media: media,
      }
    },
  },
}) 