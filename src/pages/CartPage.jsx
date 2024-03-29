import React, { useContext } from 'react';
import { Button, Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Message from '../components/Message';
import { Store } from '../context/Store';

const Cart = () => {
  const navigate = useNavigate();
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems }} = state;
  
  const updateCart = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data?.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItem = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkout = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <div className='my-3 container wide-container'>
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <h1>Shopping cart</h1>
      <Row className='bg'>
        <Col md={8}>
          {cartItems.length === 0 || !cartItems  ? (
            <Message>Cart is empty. <Link to='/'>Go to products</Link></Message>
          ) : 
          ( <ListGroup>
              {cartItems?.map((item) => (
                <ListGroupItem key={item._id} className='bg'>
                  <Row className='align-items-center bg'>
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button 
                      variant='light' 
                      disabled={item.quantity === 1}
                      onClick={() => updateCart(item, item.quantity - 1)}
                      >
                        <i className='fas fa-minus-circle'></i>
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                      variant='light' 
                      disabled={item.quantity === item.countInStock}
                      onClick={() => updateCart(item, item.quantity + 1)}
                      >
                        <i className='fas fa-plus-circle'></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button variant='light'
                      onClick={() => removeItem(item)}>                       
                        <i className='fa fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
          </ListGroup>)}
        </Col>
        <Col md={4}>
          <Card className='bg'>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroupItem className='bg'>
                  <h4>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems?.reduce((a, c) => a + c.price * c.quantity, 0)} 
                  </h4>
                </ListGroupItem>
                <ListGroupItem className='bg'>
                  <div className='d-grid'>
                    <Button
                      type='button'
                      className='blue-button'
                      disabled={cartItems?.length === 0}
                      onClick={checkout}
                    >
                      Proceed to checkout
                    </Button>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default Cart;

