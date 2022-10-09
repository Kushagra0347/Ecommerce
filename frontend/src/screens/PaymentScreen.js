import React, { useState } from "react";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Button, Form, Col } from "react-bootstrap";
// Mine
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen({ history }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  if (!shippingAddress.address) {
    history.push("/shipping");
  }

  function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/order");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <h2>Payment</h2>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method: </Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='paypal'
              name='paymentMethod'
              value={paymentMethod ? paymentMethod : ""}
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked
            />
          </Col>
        </Form.Group>

        <Button className='my-3' type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
