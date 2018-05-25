import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import query from './queries/products.gql'

class VPJ extends Component {

  static schema = {
    title: 'VPJ',
    description: 'VTEX PARTNER JOURNEY',
    type: 'object',
    properties: {
      showImages: {
        type: 'boolean',
        title: 'Show Images',
      },
    }
  }

  render() {
    const { productsQuery: { products }, showImages } = this.props
    return <div><ul>{products.map(({ productName, productId, items }) => <li key={productId}>
      <h3>{productName}</h3>
      <ul>{items.map(({ itemId, images, name }) => (
        <li key={itemId}>
          <h5>{name}</h5>
          {showImages && (<ul>{images.map(({ imageId, imageUrl }) => (
            <li key={imageId}>
              <img src={imageUrl} />
            </li>
          ))}</ul>)}
        </li>
      ))}</ul>
    </li>)}</ul></div>
  }
}

export default graphql(query, { name: 'productsQuery' })(VPJ)
