import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import React from 'react'
import { Link } from 'expo-router'
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";

const register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const baseURL = "http://192.168.1.4:4000";  // replace with your IP
  const handleRegister = async () => {
    try {
      const res = await fetch(`${baseURL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname,lastname, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      console.log("Registered!", data);
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  return (
    <View style={styles.container}>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Image source={require("../assets/logo.png")} style={styles.icon} />
        <Text style={styles.text}>Register</Text>
      </View>

      {/* Page Content */}
      <View style={styles.form}>

        {/* First & Last Name Row */}
        <View style={styles.row}>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#aaa" style={styles.inputIcon} />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={firstname}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#aaa" style={styles.inputIcon} />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={lastname}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputBoxFull}>
          <Ionicons name="mail-outline" size={18} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Email or Phone No"
            placeholderTextColor="#888"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputBoxFull}>
          <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Create New Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons name="eye-off-outline" size={18} color="#aaa" style={styles.iconRight} />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Link style={styles.link} href="/landing">Go</Link>

      </View>

    </View>
  )
}

export default register

const styles = StyleSheet.create({
  link:{
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  navbar: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: 50, // for status bar
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  icon: {
    width: 40,
    height: 40,
  },
  iconRight: {
    marginLeft: 8,
  },

  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    marginTop: 120, // push content below navbar
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputBox: {
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 55,
    width: "48%",
    borderColor: "#333",
    borderWidth: 1,
  },

  inputBoxFull: {
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 55,
    width: "100%",
    marginTop: 15,
    borderColor: "#333",
    borderWidth: 1,
  },

  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#E50914",
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  form: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",   // vertically center
    marginTop: 120,    
  },

  inputIcon: {
    marginRight: 8,
  },
})