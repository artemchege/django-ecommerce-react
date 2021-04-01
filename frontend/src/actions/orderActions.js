import { ORDER_CREATE_REQUEST, 
    ORDER_SUCCESS_REQUEST, 
    ORDER_FAIL_REQUEST,     
    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, 
    ORDER_DETAILS_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS, 
    ORDER_LIST_MY_FAIL, 
    ORDER_LIST_REQUEST, 
    ORDER_LIST_SUCCESS, 
    ORDER_LIST_FAIL,
    ORDER_DELIVERED_REQUEST,
    ORDER_DELIVERED_SUCCESS,
    ORDER_DELIVERED_FAIL, 
    ORDER_DELIVERED_RESET,
 } from '../constants/orderConstants'
import axios from 'axios'
import { CART_CLEAR_ITEMS } from '../constants/cartConstance'

export const createOrder = (order) => async (dispatch, getState) => {
    try{
        dispatch({ type: ORDER_CREATE_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
    
        const { data } = await axios.post(
            '/api/orders/add/', 
            order,
            config,
            )
        
        dispatch({ type: ORDER_SUCCESS_REQUEST, payload: data })
        dispatch({ type: CART_CLEAR_ITEMS, payload: data })
        localStorage.removeItem('cartItems')
    }catch(error){
        dispatch({type: ORDER_FAIL_REQUEST, payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message, 
        })
    }
}

export const getOrderDetails = (pk) => async (dispatch, getState) => {
    try{
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
    
        const { data } = await axios.get(`/api/orders/${pk}`, config)
        
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })
    }catch(error){
        dispatch({type: ORDER_DETAILS_FAIL, payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message, 
        })
    }
}


export const listMyOrders = () => async (dispatch, getState) => {
    try{
        dispatch({ type: ORDER_LIST_MY_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
    
        const { data } = await axios.get(`/api/orders/myorders`, config)
        
        dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data })
    }catch(error){
        dispatch({type: ORDER_LIST_MY_FAIL, payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message, 
        })
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try{
        dispatch({ type: ORDER_LIST_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
    
        const { data } = await axios.get(`/api/orders/`, config)
        
        dispatch({ type: ORDER_LIST_SUCCESS, payload: data })
    }catch(error){
        dispatch({type: ORDER_LIST_FAIL, payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message, 
        })
    }
}

export const deliverOrder = (order) => async (dispatch, getState) => {
    try{
        dispatch({ type: ORDER_DELIVERED_REQUEST })

        const {
            userLogin: {userInfo}
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            }
        }
    
        const { data } = await axios.put(`/api/orders/${order._id}/delivered/`, {}, config)
        
        dispatch({ type: ORDER_DELIVERED_SUCCESS, payload: data })
    }catch(error){
        dispatch({type: ORDER_DELIVERED_FAIL, payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message, 
        })
    }
}