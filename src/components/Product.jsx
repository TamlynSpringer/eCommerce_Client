import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import Rating from './Rating';
import { Store } from '../context/Store';
import axios from '../api/axios';

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const addToCart = async (item) => {
    console.log('product:', product)
    const existItem = cartItems.find((x) => x._id === product._id);
    console.log('item:', existItem)
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Product out of stock');
      return;
    }
    console.log('quantity:', quantity)
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className='product bg'>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className='card-img-top' />
      </Link>
      <Card.Body className='bg'>
        <Link to={`/product/${product.slug}`}>
          <Card.Title className='bg'>{product.name}</Card.Title>
        </Link>  
        {/* <Rating rating={product.rating} numReviews={product.numReviews} />           */}
        {/* <Card.Text>Store {product.storeId}</Card.Text> */}
        <Card.Text><strong>${product.price}</strong></Card.Text>
        <Card.Text>
          <Link to={`/seller/${product?.seller?._id}`}>{product.seller?.seller?.name}</Link>
        </Card.Text>

        {product.countInStock === 0 
        ? <Button variant='light' disabled>Out of stock</Button> 
        : <Button onClick={() => addToCart(product)} className='cart-button'>Add to cart</Button>}
        
      </Card.Body>
    </Card>
  )
};

export default Product;