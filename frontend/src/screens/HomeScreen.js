// REACT
import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
// REACT-Redux
import { useDispatch, useSelector } from "react-redux";
// Mine
import Product from "../components/Product";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products } = productList;
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : error ? (
        <Message variant={"danger"}>
          <h3>error</h3>
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}

export default HomeScreen;
