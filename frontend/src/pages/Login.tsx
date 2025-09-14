import React, { useState } from "react";
import { Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token); // save JWT
        navigate("/dashboard"); // redirect after login
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={6} maxW="md" mx="auto" mt={20} borderWidth="1px" borderRadius="md">
      <VStack gap={4}>
        <Text fontSize="xl" fontWeight="bold">Login</Text>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
        <Button variant="link" onClick={() => navigate("/register")}>
          Don't have an account? Register
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
