import axios from '../api/axios';
import { getError } from '../utils/utils';
import React, { useEffect, useReducer } from 'react';
import { Badge, Card, Col, Row, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };
        case 'FETCH_SELLER_REQUEST':
            return { ...state, loadingSeller: true };
        case 'FETCH_SELLER_SUCCESS':
            return { ...state, user: action.payload, loadingSeller: false };
        case 'FETCH_SELLER_FAIL':
            return { ...state, error: action.payload, loadingSeller: false };

        default:
            return state;
    }
};

export default function SellerPage() {
    const [{ loading, error, products, loadingSeller, user }, dispatch] = useReducer(reducer, {
        products: [],
        user: {},
        loading: true,
        error: '',
    });

    const params = useParams();
    const { id: sellerId } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const result = await axios.get(`/api/products?seller=${sellerId}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

                dispatch({ type: 'FETCH_SELLER_REQUEST' });
                const user = await axios.get(`/api/users/seller/${sellerId}`);
                dispatch({ type: 'FETCH_SELLER_SUCCESS', payload: user.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                dispatch({ type: 'FETCH_SELLER_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [sellerId]);

    console.log(user.seller, user._id)

    return (
        <section className='mt-3'>
            <Helmet>
                <title>Store</title>
            </Helmet>
            <Row>
              <Col md={3}>
                {loadingSeller ? (
                  <Loading />
                ) : error ? (
                  <Message variant="warning">{error}</Message>
                ) : (
                    <Card className='bg'>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item className='bg'>
                            <Row>
                                <Col>Store name: {user?.seller?.name}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='bg'>
                            <Row>
                                <Col>Store description: {user?.seller?.description}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='bg'>
                            <Row>
                                <Col>
                                    <Badge bg="warning"> <a className="text-decoration-none text-white" href={`mailto:${user?.email}`}>Contact seller</a></Badge>
                                </Col>
                            </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
                <Col md={9}>
                    <Row>
                        {loading ? (
                            <Loading></Loading>
                        ) : error ? (
                            <Message variant="warning">{error}</Message>
                        ) : (
                            <>
                                {products.length === 0 && <Message>No product found</Message>}
                                {products.map((product) => (
                                    <Col xs={6} md={4} lg={4} key={product.slug} className="mb-3">
                                        <Product key={product._id} product={product}></Product>
                                    </Col>

                                ))}
                            </>
                        )}
                    </Row>
                </Col>
            </Row >
        </section>
    );
}