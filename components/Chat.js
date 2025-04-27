import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import Response from "./response";
import Message from "./message";
import { COLORS } from './Colors';

export default function Chat() {
	const [inputText, setInputText] = useState("");
	const [listData, setListData] = useState([]);
	const SearchInput = () => {
		setListData((prevList) => [...prevList, inputText]);
		setInputText("");
	};

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

			{/* Header */}
			<View style={styles.header}>
				<Image source={require("./assets/icons/robot.png")} style={styles.icon} />
				<Text style={{ fontSize: 24, fontWeight: "800", color: "#323232" }}>RAVYA</Text>
			</View>

			{/* Content */}
			<FlatList
				style={{ paddingHorizontal: 16, marginBottom: 80 }}
				data={listData}
				renderItem={({ item }) => (
					<View>
						<Message message={item} />
						<Response prompt={item} />
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>

			{/* Search-Bar */}
			<View style={styles.searchBar}>
				<TextInput placeholder="Ask RAVYA" style={styles.input} value={inputText} onChangeText={(text) => setInputText(text)} selectionColor={"#323232"}></TextInput>
				<TouchableOpacity onPress={SearchInput}>
					<Image source={require("./assets/icons/right-arrow.png")} style={styles.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

// Updated styles for Chat.js
// Import the COLORS from the colors file

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    margin: 8,
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: COLORS.primary,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    elevation: 4,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    backgroundColor: COLORS.primaryVeryLight,
    width: '100%',
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    color: COLORS.textPrimary,
  },
});