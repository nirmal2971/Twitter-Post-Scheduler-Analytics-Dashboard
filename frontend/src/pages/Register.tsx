import React, { useState } from "react";
import { Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token); // save JWT
        navigate("/dashboard"); // redirect after register
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
        <Text fontSize="xl" fontWeight="bold">Register</Text>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button colorScheme="green" onClick={handleRegister}>Register</Button>
        <Button variant="link" onClick={() => navigate("/login")}>
          Already have an account? Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
