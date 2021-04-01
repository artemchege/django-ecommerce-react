import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";


function UserEditScreen({ match, history }) {

  const userId = match.params.id

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { error:updateError, success:updateSuccess } = userUpdate;

  useEffect(() => {
    if (updateSuccess) {
        dispatch({type: USER_UPDATE_RESET})
        history.push('/admin/userlist/')
    }

    if(!user.name || user._id != userId) {
        dispatch(getUserDetails(userId))
    } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
    }
  }, [user, updateSuccess]);

  const submitHander = (e) => {
    e.preventDefault();
    dispatch(updateUser(userId, {name, email, isAdmin}))
    dispatch(getUserDetails(userId))
  };

  return (
      <div>
        <Link to='/admin/userlist/' className='btn btn-primary my-4'>Go Back</Link>
        <FormContainer>
            <h1 className="my-4">Edit User</h1>
            {updateError && <AlertMessage variant='danger'>{updateError}</AlertMessage>}
            {loading ? <Loader /> : error? <AlertMessage variant='danger'>{error}</AlertMessage> : (
                <Form onSubmit={submitHander} className="my-4">
                <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
                </Form.Group>

                <Form.Group controlId="isadmin">
                <Form.Check
                    type="checkbox"
                    label="Is Admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
                </Form.Group>

                <Button type="submit" variant="primary">
                Sign In
                </Button>

            </Form>
            )}
            
        </FormContainer>
    </div>
  );
}

export default UserEditScreen;
