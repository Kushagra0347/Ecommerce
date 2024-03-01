import React, { useEffect } from "react";
// React Router
import { Link } from "react-router-dom";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
// Mine
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function OrderScreen({ history }) {
  const dispatch = useDispatch();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  cart.itemsPrice = cartItems
    .reduce((acc, cartItem) => acc + cartItem.price * cartItem.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);

  //   8.2% tax on itemPrice
  cart.taxPrice = Number(0.082 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  if (!paymentMethod) {
    history.push("/payment");
  }

  useEffect(() => {
    if (success) {
      history.push(`/confirm-order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, history, dispatch]);

  function placeOrder(e) {
    e.preventDefault();
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }),
    );
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>
                  Shipping: {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.pinCode}, {shippingAddress.country}
                </strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>

              <p>
                <strong>Method: {paymentMethod}</strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {cartItems.length === 0 ? (
                <Message variant={"info"}>Your Cart is Empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((cartItem, index) => {
                    return (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={2}>
                            <Image
                              src={cartItem.image}
                              alt={cartItem.name}
                              fluid
                              rounded
                            />
                          </Col>

                          <Col>
                            <Link to={`/product/${cartItem.product}`}>
                              {cartItem.name}
                            </Link>
                          </Col>

                          <Col md={4}>
                            {cartItem.qty} X ₹{cartItem.price} = ₹
                            {(cartItem.qty * cartItem.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message vriant='danger'>{error}</Message>}
              </ListGroup.Item>

              <Button
                type='submit'
                className='btn-block w-full mx-3 my-2'
                disabled={cartItems.length === 0}
                onClick={placeOrder}>
                Place Order
              </Button>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
