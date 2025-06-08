import React from 'react'
import Product from './components/product'

async function page() {
  throw new Error("This is a server component, please use it as such.");
  return (
    <div>
      <Product />
    </div>
  )
}

export default page
