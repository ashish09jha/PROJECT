import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const FormContainer = styled.div`
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1rem;
  background-color: ${(props) => (props.primary ? "#4CAF50" : "#008CBA")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleButton = styled(Button)`
  background-color: transparent;
  color: #333;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    color: #007bff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

// Form components
const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    loginAs: ''
  });
  const navigate = useNavigate(); 

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '', loginAs: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const response = await axios.post('http://localhost:8000/api/v1/users/signUp', formData);
        console.log(response.data);
        if (response.data && response.data.statusCode === 200) {
          navigate('/e-learning');
        } else if(response.data && response.data.statusCode === 500){
          alert("user already exists")
        }else {
          alert("Please wait for admin approval. Try again later.");
        }
      } else {
        // Login API Call
        const response = await axios.post('http://localhost:8000/api/v1/users/login', {
          email: formData.email,
          password: formData.password,
          loginAs: formData.loginAs
        });
        alert(response.data.message);
        localStorage.setItem('loginAs', formData.loginAs); 
        navigate('/e-learning');
      }
      setFormData({ name: '', email: '', password: '', loginAs: '' }); // Clear form after submission
    } catch (error) {
      alert(error.response?.data?.message || "User not found or incorrect credentials");
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>{isSignUp ? "Register" : "Login"}</Title>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          )}
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <Select
            name="loginAs"
            value={formData.loginAs}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Register As
            </option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </Select>
          <Button primary type="submit">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
        </form>
        <ToggleButton onClick={handleToggle}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </ToggleButton>
      </FormContainer>
    </Container>
  );
};

export default Signup;
