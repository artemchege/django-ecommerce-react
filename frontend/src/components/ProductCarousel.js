import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import AlertMessage from './AlertMessage'
import { productsTop } from '../actions/productActions'


function ProductCarousel() {
    const dispatch = useDispatch()
    const productTop = useSelector(state => state.productTop)
    const {topProducts, error, loading} = productTop 

    useEffect(() => {
        dispatch(productsTop())
    }, [])

    return (
        <div>
            {loading ? <Loader></Loader> 
            : error? <AlertMessage variant='danger'>{error}</AlertMessage> 
            : (
                <Carousel pause='hover' className='bg-light'>
                    {topProducts.map((product) => (
                        <Carousel.Item key={product._id}>
                            <Link to={`/prouct/${product._id}`}>
                                <Image src={product.image} alt={product.name} fluid></Image>
                                <Carousel.Caption className='carousel.caption'>
                                    <h4>{product.name}</h4>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
        </div>
    )
}

export default ProductCarousel
