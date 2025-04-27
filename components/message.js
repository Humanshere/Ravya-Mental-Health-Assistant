import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { COLORS } from './Colors';

const date = new Date();

export default function Message(props) {
	return (
		<View style={styles.message}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("./assets//icons/user.png")} style={styles.icon} />
					<Text style={{ fontWeight: 500 }}>Username</Text>
				</View>
				<Text style={{ fontSize: 10, fontWeight: 600 }}>
					{date.getHours()}:{date.getMinutes()}
				</Text>
			</View>
			<Text style={{ fontSize: 14, width: "100%", flex: 1, paddingLeft: 0 }}>{props.message}</Text>
		</View>
	);
}

// Updated styles for Message.js
// Import the COLORS from the colors file


const styles = StyleSheet.create({
  message: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: COLORS.primaryVeryLight,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderTopRightRadius: 4,
    elevation: 1,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: COLORS.textPrimary,
  },
  messageHeader: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
  },
  userName: {
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  messageText: {
    fontSize: 14,
    width: "100%",
    flex: 1,
    paddingLeft: 0,
    color: COLORS.textPrimary,
    lineHeight: 20,
  }
});
