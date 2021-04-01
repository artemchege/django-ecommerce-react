import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')

    let history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword) {
            history.push(`/?keyword=${keyword}&page=1`)
        } else {
            history.push(history.push(history.location.pathname))
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control 
            type='text' 
            name='q' 
            onChange={e => setKeyword(e.target.value)}
            className='mr-1 ml-1'
            ></Form.Control>
            <Button type='submit' variant='success outlined' className='p-2 mr-4'>Search</Button>
        </Form>
    )
}

export default SearchBox
