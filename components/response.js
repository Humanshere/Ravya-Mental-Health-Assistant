import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import AsyncStorage from '@react-native-async-storage/async-storage';

const date = new Date();
const API_KEY = "AIzaSyDT1s8aYX1lyyorvfHwsXDdCGFlbhequXw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Key for storing chat history
const HISTORY_STORAGE_KEY = 'chatHistory';

// Default initial prompt to set up the bot's persona
const initialHistory = [
  {
    role: "user",
    parts: [{ text: "You are a supportive bot named Ravya. From the next prompt, Have a friendly conversation with me and answer with short mental health advices when required. Also at the end of your response you must rate my mood on a scale of 1 to 10, write the Mood: 'number'." }],
  },
  {
    role: "model",
    parts: [{ text: "Okay! I'm ready to chat. How are you doing today? I'm here to listen and offer some support if you need it. Just let me know what's on your mind." }],
  },
];

export default function Response(props) {
  const [generatedText, setGeneratedText] = useState("");
  const [history, setHistory] = useState(initialHistory);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load chat history from AsyncStorage
  const loadChatHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
      }
      setIsHistoryLoaded(true);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setIsHistoryLoaded(true);
    }
  };

  // Save chat history to AsyncStorage
  const saveChatHistory = async (updatedHistory) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!isHistoryLoaded) return;
    
    // Create a new history array with the user's message
    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: props.prompt }] }
    ];
    
    // Update state with the user's message
    setHistory(updatedHistory);
    
    try {
      // Send the entire history in the request
      const result = await model.generateContent({
        contents: updatedHistory,
      });
      const response = await result.response;
      const text = response.candidates[0].content.parts[0].text;
      setGeneratedText(text);

      // Add the model's response to the history
      const finalHistory = [
        ...updatedHistory,
        { role: 'model', parts: [{ text }] }
      ];
      
      // Update state with the model's response
      setHistory(finalHistory);
      
      // Save the updated history to AsyncStorage
      saveChatHistory(finalHistory);

      console.log('Model:', text);

      // Optionally limit history size if needed
      // const limitedHistory = finalHistory.slice(-20); // Keep last 20 messages
      // setHistory(limitedHistory);
      // saveChatHistory(limitedHistory);
      
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  useEffect(() => {
    if (props.prompt && isHistoryLoaded) {
      sendMessage();
    }
  }, [props.prompt, isHistoryLoaded]);
  
  return (
    <View style={styles.response}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image source={require("./assets/icons/robot.png")} style={styles.icon} />
          <Text style={{ fontWeight: 600 }}>Mental Health Bot</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: "600" }}>
          {date.getHours()}:{date.getMinutes()}
        </Text>
      </View>
      <Markdown>{generatedText}</Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  response: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#fafafa",
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
  },
  icon: {
    width: 28,
    height: 28,
  },
});