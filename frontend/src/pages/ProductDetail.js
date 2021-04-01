import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";
import React, { Component, useEffect, useState } from "react";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

export default function ProductDetail({match, history}) {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch();

  const Product = useSelector((state) => state.productDetails);
  const { error, loading, product } = Product;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { loading:loadingProductReview, success:successProductReview, error:errorProductReview } = productReviewCreate;
  
  useEffect(() => {
    if(successProductReview) {
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(product._id, {rating, comment}))
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Back to shop
      </Link>

      {loading ? <Loader /> : error ? <AlertMessage variant='danger'>{error}</AlertMessage> : (
        <div>
          <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
                <Rating
                  value={product.rating}
                  text={product.numReviews + " reviews"}
                />
              </ListGroup.Item>

              <ListGroup.Item>
                <h4>Price: {product.price}$</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <span>Description: {product.description}</span>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card className="p-2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{product.countInStock > 0 ? "In stock" : "empty"}</Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock>0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        Qty
                      </Col>
                      <Col xs='auto' className='my-1'>
                        <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                            {
                              [...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))
                            }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className={
                      product.countInStock > 0
                        ? "btn btn-block"
                        : "btn btn-block disabled"
                    }
                    type="button"
                  >
                    Add to cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
          <Row>
            <Col md={6} className='my-4'>
              <h4>
                Reviews
              </h4>
              {product.reviews.length === 0 && <AlertMessage variant='info'>There is no reviews</AlertMessage>}
              <ListGroup variant='flush'>
                  {product.reviews.map(review => (
                    <ListGroup.Item key={review._id}>
                        <h5>{review.name}</h5>
                        <Rating value={review.rating}></Rating>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}

                  <ListGroup.Item>
                    <h4>Write a review</h4>

                    {loadingProductReview && <Loader></Loader>}
                    {successProductReview && <AlertMessage variant='info'>Review submitted</AlertMessage>}
                    {errorProductReview && <AlertMessage variant='danger'>{errorProductReview}</AlertMessage>}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                          <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                              <option value=''>Select...</option>
                              <option value='1'>1 - shitty </option>
                              <option value='2'>2 - hm...</option>
                              <option value='3'>3 - not bad</option>
                              <option value='4'>4 - nice one</option>
                              <option value='5'>5 - the choice of my life</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId='comment'>
                            <Form.Label>Review</Form.Label>
                            <Form.Control as='textarea' row={5} value={comment} onChange={e => setComment(e.target.value)}>
                            </Form.Control>
                          </Form.Group>
                          <Button className='btn btn-block' disabled={loadingProductReview} type='submit'>
                            Sumbit
                          </Button>
                      </Form>
                    ) : <AlertMessage variant='info'>
                      To comment you must <Link to='/login'>login</Link>
                      </AlertMessage>}
                  </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
        )}
    </div>
  );
}
