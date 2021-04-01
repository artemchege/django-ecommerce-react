import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("Stripe");

  if (!shippingAddress.address) {
    history.push("/shipping");
  }

  const sumbitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod))
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      <Form onSubmit={sumbitHandler}>
          <Form.Group>
              <Form.Label as='legend'>
                  Select Method
              </Form.Label>
              <Col>
                <Form.Check type='radio' label='Stripe' id='Stripe' name='paymentMethod' checked onChange={(e) => setPaymentMethod(e.target.value)}>
                </Form.Check>
              </Col>
          </Form.Group>


        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>

    </FormContainer>
  );
}

export default PaymentScreen;
