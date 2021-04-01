import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productReviewCreateReducer, productsTopReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducer'
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderListReducer, orderDeliveredReducer } from './reducers/orderReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers'


const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer, 
    productCreate: productCreateReducer, 
    productUpdate: productUpdateReducer, 
    productReviewCreate: productReviewCreateReducer, 
    productTop: productsTopReducer,

    cart: cartReducer, 
    
    userLogin: userLoginReducer, 
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer, 
    userUpdateProfile: userUpdateProfileReducer, 
    userList: userListReducer, 
    userDelete: userDeleteReducer, 
    userUpdate: userUpdateReducer, 

    orderCreate: orderCreateReducer, 
    orderDetails: orderDetailsReducer, 
    orderListMy: orderListMyReducer, 
    orderList: orderListReducer, 
    orderDelivered: orderDeliveredReducer, 

})

const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingFromStorage = localStorage.getItem('shippingAddress') ? 
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: {cartItems: cartItemsFromStorage, shippingAddress: shippingFromStorage},
    userLogin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store 










