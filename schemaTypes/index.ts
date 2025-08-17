import { type SchemaTypeDefinition } from 'sanity'

import portfolio from './portfolio'
import product from './product'
import customerTestimonial from './customerTestimonial'
import SindhCapest from './SindhCapest'
import BalochiDresses from './BalochiDresses'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolio, product, customerTestimonial,SindhCapest,BalochiDresses ],
}
