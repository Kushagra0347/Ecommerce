// REACT
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// React Bootstrap
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// Mine
import Rating from "../components/Rating";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen({ match, history }) {
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;
  const stockCount = [...Array(product.countInStock).keys()];

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);

  function addToCart() {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>
          <h3>{error}</h3>
        </Message>
      ) : (
        <>
          <Link to='/'>
            <Button type='button' variant='light' className='mb-4'>
              Go Back
            </Button>
          </Link>
          <Row>
            <Col md={6}>
              <Image
                src={product.image}
                alt={product.name}
                style={{ width: "100%" }}
              />
            </Col>

            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    reviews={product.numReviews}
                    color='#f8e825'
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>

                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>₹{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 ? (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty: </Col>
                        <Col xs={6} md={7} className='my-1'>
                          <Form.Control
                            as='select'
                            className='form-select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}>
                            {stockCount.map((q) => (
                              <option key={q + 1} value={q + 1}>
                                {q + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ) : (
                    <></>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCart}
                      className='btn-block w-100'
                      type='button'
                      disabled={product.countInStock <= 0 ? true : false}>
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default ProductScreen;
