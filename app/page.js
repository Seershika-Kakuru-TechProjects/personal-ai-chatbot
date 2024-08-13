'use client'
import React, { useState, useEffect, useRef } from 'react';
import {Stack,TextField, Button, Box, Container, Typography} from '@mui/material';
import '@fontsource/dancing-script/700.css'; 

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm a personal support assistant. How can I help you today?",
    },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newMessages = [...messages, { role: 'user', content: input },{ role: 'assistant', content: '' },];
    setMessages(newMessages);

    try {
  
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: input}]),
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await res.json();
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]
        let otherMessages = messages.slice(0, messages.length - 1)
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + data.response },
        ]
      })
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
          ...messages,
          { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }

    setInput('');
  };

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  return (
    <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    bgcolor={'#dbf3fa'}
  >
    
    <Stack
      direction={'column'}
      width="700px"
      height="700px"
      border="4px outset black"
      p={2}
      spacing={3}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
      bgcolor="#fff"
      borderRadius={10}
      
    >
      <Typography variant="h4" 
        component="div" 
        gutterBottom display='flex' 
        justifyContent='center' 
        alignItems={"center"}
        style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 'bold'}}
        bgcolor='#FFF9C4'
        borderRadius={16}
        border="4px dotted black"
        >
          Personal AI Chatbot
      </Typography>
      <Stack
        direction={'column'}
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxHeight="100%"
        padding={2}
        
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
          >
            <Box
              bgcolor={
                message.role === 'assistant'
                  ? '#F8E1E1'//'#f8d7da'
                  : '#D9F8C4'//'#d1e7dd'
              }
              color="black"
              borderRadius={16}
              p={3}
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.5)" 
              style={{ fontFamily: 'Lora, serif', fontStyle: 'oblique',fontSize: 20}}
            >
              {message.content}
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '20px',  }} padding={2}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder='Ask a question...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              style: {
                fontFamily: 'Lora, serif',
                fontStyle: 'oblique',
              },
            }}
            style={{ marginRight: '10px'}}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#ccc', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ccc', // Border color when focused
                },
            }}}
           
          />
          <Button type="submit" variant="contained"
          
          style={{ backgroundColor: '#bf8bff', 
                  color: '#fff', 
                  fontFamily: 'serif',
                  boxShadow:"0px 2px 4px rgba(0, 0, 0, 0.5)",
                  fontSize: 16}}>
            Send
          </Button>
        </form>

    </Stack>
  </Box>
  
  );
}
