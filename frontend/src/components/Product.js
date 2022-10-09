import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Rating from "./Rating";

function Product({ product }) {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link
        to={`/product/${product._id}`}
        style={{
          height: "15.753rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundImage: `url("${product.image}")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}></div>
        {/* <Card.Img src={product.image} style={{ height: "100%" }} /> */}
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <div className='my-3'>
            <Rating
              rating={product.rating}
              reviews={product.numReviews}
              color={"#f8e825"}
            />
          </div>
        </Card.Text>

        <Card.Text as='h3' className='h-100'>
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
