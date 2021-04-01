import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, deliverOrder } from "../actions/orderActions";
import { ORDER_DELIVERED_RESET } from "../constants/orderConstants";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51IT6IwHbJhOfoAEvYBPNjlpDboyqz87KN0M3EZ3eBTwZCjACXXRRfiPB598KGbTkVE563k7lyxxUlLMdTYuIYz0200Qideg8UN');

function OrderScreen({ match }) {
  const orderId = match.params.id;

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderDelivered = useSelector((state) => state.orderDelivered);
  const { success:successDelivered, error:errorDelivered, loading:loadingDelivered } = orderDelivered;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error && order) {
    order.orderPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  useEffect(() => {
    if (!order || order._id !== Number(order.id) || successDelivered) {
      dispatch({ type: ORDER_DELIVERED_RESET })
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, successDelivered]);

  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const { data } = await axios.post(
        '/api/orders/create-checkout-session/', 
        {'order': order._id}
        )

    const result = await stripe.redirectToCheckout({
      sessionId: data.id,
    });
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader></Loader>
  ) : error ? (
    <AlertMessage variant="danger">{error}</AlertMessage>
  ) : (
    <div>
      <h1>Order: {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {order.user.name}</strong>
              </p>
              <p>
                <strong>Email: {order.user.email}</strong>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"   "}
                {order.shippingAddress.postalCode}
                {"   "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <AlertMessage variant="success">
                  Delivered on {order.deliveredAt}
                </AlertMessage>
              ) : (
                <AlertMessage variant="warning">
                  Order is not delivered
                </AlertMessage>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <AlertMessage variant="success">
                  Paid on {order.paidAt}
                </AlertMessage>
              ) : (
                <AlertMessage variant="warning">Order is not paid</AlertMessage>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <AlertMessage variant="info">Order is empty</AlertMessage>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price}$ ={" "}
                          {(item.qty * item.price).toFixed(2)}$
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>{order.orderPrice}$</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice}$</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax Price:</Col>
                  <Col>{order.taxPrice}$</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total Price:</Col>
                  <Col>{order.totalPrice}$</Col>
                </Row>
              </ListGroup.Item>
                
                { order.isPaid ? (
                    <Button role="link" className='btn btn-block primary' disabled>
                        {" "}
                        Order is paid already
                    </Button>
                ) : (
                    <Button role="link" className='btn btn-block primary' onClick={handleClick}>
                        {" "}
                        Pay Stripe
                    </Button>
                )}

                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <Button role="link" className='btn btn-block primary' onClick={deliverHandler}>
                        {" "}
                        Mark as Delivered
                    </Button>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
