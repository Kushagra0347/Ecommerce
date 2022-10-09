import React, { useState } from "react";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Button, Form } from "react-bootstrap";
// Mine
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen({ history }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [country, setCountry] = useState(shippingAddress.country);
  const [city, setCity] = useState(shippingAddress.city);
  const [pinCode, setPinCode] = useState(shippingAddress.pinCode);

  function submitHandler(e) {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        country,
        pinCode,
      }),
    );

    history.push("/payment");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address: </Form.Label>
          <Form.Control
            type='text'
            name='address'
            placeholder='Enter Address'
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City: </Form.Label>
          <Form.Control
            type='text'
            name='city'
            placeholder='Enter City'
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country: </Form.Label>
          <Form.Control
            type='text'
            name='country'
            placeholder='Enter Country'
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId='pinCode'>
          <Form.Label>Pin Code: </Form.Label>
          <Form.Control
            type='text'
            name='pinCode'
            placeholder='Enter Pin Code'
            value={pinCode ? pinCode : ""}
            onChange={(e) => setPinCode(e.target.value)}
            required
          />
        </Form.Group>

        <Button className='my-3' type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
