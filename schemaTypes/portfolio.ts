import type { Rule as ValidationRule } from "sanity";

export default {
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: ValidationRule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.required().positive(),
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule: ValidationRule) => Rule.required().min(1),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "color",
      title: "Color",
      type: "string",
    },
    {
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "inStock",
      title: "In Stock?",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "isNew",
      title: "Is New?",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "isSale",
      title: "On Sale?",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Average rating (1-5)",
      validation: (Rule: ValidationRule) => Rule.min(1).max(5),
    },
    {
      name: "reviews",
      title: "Number of Reviews",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.min(0),
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
    },
  },
};