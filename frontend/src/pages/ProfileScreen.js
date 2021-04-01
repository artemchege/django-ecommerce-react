import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { useDispatch, useSelector, useStore } from "react-redux";
import { listMyOrders } from '../actions/orderActions'
import { getUserDetails, updateUserProfile } from "../actions/userActions";

function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading:loadingOrders, error:errorOrders, orders } = orderListMy;


  useEffect(() => {
    if (!userInfo) {
        history.push('/login')
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders())
      } else {
        setName(userInfo.name);
        setEmail(userInfo.email);
      }
    }
  }, [dispatch, user, error, history]);

  const submitHander = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile(name, email, password));
      setMessage(""); // in case to clear 'Passwords do not match'
    }
  };

  return (
    <Row className="my-4">
      <Col md={3}>
        <h2>User profile</h2>
        {error && (
          <AlertMessage variant="danger" className="my-4">
            Oops! {error}
          </AlertMessage>
        )}
        {loading && <Loader />}
        {message && (
          <AlertMessage variant="danger" className="my-4">
            Oops! {message}
          </AlertMessage>
        )}
        <Form onSubmit={submitHander} className="my-4">
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="passwordConfirm">
            <Form.Label>Confirm your password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My orders</h2>
        {loadingOrders? 
        (<Loader></Loader>) : 
        errorOrders? 
        <AlertMessage variant='danger'>{errorOrders}</AlertMessage> : (
          <Table striped responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Order</th>
                </tr>
              </thead>
              <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>{order.totalPrice}$</td>
                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                        <td>{order.isDelivered ? (<i class="fas fa-check"></i>) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                        <td><Link to={'/order/'+order._id}><Button className='btn-sm'>View order</Button></Link></td>
                    </tr>
                  ))}
              </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
