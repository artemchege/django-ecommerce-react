import { Card } from "react-bootstrap";
import React, { Component } from "react";
import Rating from './Rating.js';
import { Link } from 'react-router-dom'

export default class Product extends Component {
  render() {
    return (
        <Card className="my-3 p-3 rounded">
          <Link to={`product/${this.props.product._id}`}>
            <Card.Img style={{height: '400px'}} src={this.props.product.image} />
          </Link>
          <Card.Body>
            <Link to={`product/${this.props.product._id}`}>
              <Card.Title>{this.props.product.name}</Card.Title>
            </Link>
            <Card.Text as='div'>
              <div className="my-3">
                <Rating value={this.props.product.rating} text={this.props.product.numReviews + ' reviews'} color={'#f8e825'}/>
              </div>
            </Card.Text>
            <Card.Text as='h4'>
                {this.props.product.price}{" "}$
            </Card.Text>
          </Card.Body>
        </Card>
    );
  }
}
