import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customerTestimonial',
  title: 'Customer Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      validation: rule => rule.required(),
    }),
    // Removed product picture (product reference) field
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'testimonial',
    },
    prepare(selection: { title?: string; subtitle?: string }) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: subtitle ? subtitle.substring(0, 40) + (subtitle.length > 40 ? '...' : '') : '',
      }
    },
  },
}) 