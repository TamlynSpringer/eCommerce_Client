import { useEffect, useReducer } from 'react';
import axios from '../api/axios';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default: 
      return state;
  }
};

const Home = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, { 
    products: [],
    loading: true, 
    error: '' 
  });

  useEffect(() => {    
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message })
      }
    };
    fetchData();
  }, []);

  return (
    <div className='home my-3'>
      <Helmet>
        <title>
          Baltic Store
        </title>
      </Helmet>
      <h2 className='my-3'>Featured products</h2>
      <section className='products d-flex justify-content-between'>
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant='warning' aria-live="assertive">{error}</Message>
        ) : (
          <Row>
          {products?.map(product => (
            <Col key={product._id} sm={6} md={4} lg={3} className='mb-3' >
              <Product product={product} />
            </Col>
            ))} 
          </Row>         
        )}
      </section>
    </div>
  )
};

export default Home;