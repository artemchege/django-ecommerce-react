import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import AlertMessage from "../components/AlertMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_RESET,
} from "../constants/productConstants";

function ProductListScreen({ history, match }) {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: createLoading,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const { success: successDelete, error: errorDelete } = productDelete;

  const dispatch = useDispatch();

  let keyword = history.location.search

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    dispatch({ type: PRODUCT_UPDATE_RESET });
    if (userInfo && userInfo.isAdmin) {
      if (successCreate) {
        history.push(`/admin/product/${createdProduct._id}/edit/`);
      } else {
        dispatch(listProducts(keyword));
      }
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, keyword]);

  const deleteHandler = (id) => {
    if (window.confirm("Are your sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Button
          </Button>
        </Col>
      </Row>

      {errorDelete && (
        <AlertMessage variant="danger">{errorDelete}</AlertMessage>
      )}
      {errorCreate && (
        <AlertMessage variant="danger">{errorCreate}</AlertMessage>
      )}

      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <AlertMessage variant="danger">{error}</AlertMessage>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-sm">Edit</Button>
                    </LinkContainer>
                    <Button className="ml-1 btn-sm">
                      <i
                        className="fas fa-trash"
                        onClick={() => deleteHandler(product._id)}
                      ></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Paginate page={page} pages={pages} isAdmin={true}></Paginate>
    </div>
  );
}

export default ProductListScreen;
