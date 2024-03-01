import React, { useEffect, useState } from "react";
//Axios
import axios from "axios";
// React Router
import { Link } from "react-router-dom";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
// Mine
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrder, updateOrder } from "../actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";

function ConfirmOrderScreen({ match }) {
  const [sdkReady, setSdkReady] = useState(false);

  const orderId = match.params.id;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const payOrder = useSelector((state) => state.payOrder);
  const { loading: loadingPay, success: successPay } = payOrder;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, orderItem) => acc + orderItem.price * orderItem.quantity, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AXcruf9iBHps2R1TGMjs1HS2eVHABJxpFIh6hLK4VvyZF_5X6-G-4tnRWbB3Fhdt2bmYIlK7jw_3fCYt";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const successPaymentHandler = (paymentResult) => {
    dispatch(updateOrder(orderId, paymentResult));
  };

  useEffect(() => {
    if (!order || successPay || order._id !== Number(orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrder(orderId));
    } else if (!order.is_paid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay]);

  return loading ? (
    <Loader height={10} />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <div>
        <h1>Confirm Order</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>{" "}
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>
                    Shipping: {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.pinCode},{" "}
                    {order.shippingAddress.country}
                  </strong>
                </p>
                {order.is_delivered ? (
                  <Message variant='success'>
                    Delivered on{" "}
                    {new Date(order.delivered_at).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Message>
                ) : (
                  <Message variant='warning'>Not Delivered</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment</h2>
                <p>
                  <strong>Method: {order.payment_method}</strong>
                </p>
                {order.is_paid ? (
                  <Message variant='success'>
                    Paid on{" "}
                    {new Date(order.paid_at).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Message>
                ) : (
                  <Message variant='warning'>Not Paid</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>

                {order.orderItems.length === 0 ? (
                  <Message variant={"info"}>Order is Empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((orderItem, index) => {
                      return (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={2}>
                              <Image
                                src={orderItem.image}
                                alt={orderItem.name}
                                fluid
                                rounded
                              />
                            </Col>

                            <Col>
                              <Link to={`/product/${orderItem.product}`}>
                                {orderItem.name}
                              </Link>
                            </Col>

                            <Col md={4}>
                              {orderItem.quantity} X ₹{orderItem.price} = ₹
                              {(orderItem.quantity * orderItem.price).toFixed(
                                2,
                              )}
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
                    <Col>₹{order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping: </Col>
                    <Col>₹{order.shipping_price}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax: </Col>
                    <Col>₹{order.tax_price}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total: </Col>
                    <Col>₹{order.total_price}</Col>
                  </Row>
                </ListGroup.Item>

                {!order.is_paid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.total_price}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ConfirmOrderScreen;
