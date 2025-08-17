import type { Rule as ValidationRule } from "sanity";

export default {
  name: "balochiDress",
  title: "Balochi Dress",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: ValidationRule) => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: ValidationRule) => Rule.required()
    },
    {
      name: "price",
      title: "Price (PKR)",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.required().min(0)
    },
    {
      name: "originalPrice",
      title: "Original Price (PKR)",
      type: "number"
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule: ValidationRule) => Rule.required().min(1)
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Average rating (1-5)",
      validation: (Rule: ValidationRule) => Rule.min(1).max(5)
    },
    {
      name: "reviews",
      title: "Number of Reviews",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.min(0)
    },
    {
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "description",
      title: "Description",
      type: "text"
    },
    {
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "isNew",
      title: "Is New?",
      type: "boolean",
      initialValue: false
    },
    {
      name: "isSale",
      title: "On Sale?",
      type: "boolean",
      initialValue: false
    },
    {
      name: "isLimited",
      title: "Is Limited Edition?",
      type: "boolean",
      initialValue: false
    },
    {
      name: "inStock",
      title: "In Stock?",
      type: "boolean",
      initialValue: true
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "balochi-dress",
      readOnly: true
    }
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0"
    }
  }
}
