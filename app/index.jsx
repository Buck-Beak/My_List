import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const fullText = "MY LIST";
  //const [displayedText, setDisplayedText] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;


  // Typing effect
  /*useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev = "") => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);*/

  // Continuous arrow animation (loop)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [slideAnim]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12], // how far arrow moves
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.icon} />

      {/* Title */}
      {/*{displayedText ? <Text style={styles.title}>{displayedText}</Text> : null}*/}
      <Text style={styles.title}>MY LIST</Text>

      {/* Get Started Button with Animated Arrow */}
      <TouchableOpacity activeOpacity={0.8}>
        <Link href='/register' style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Animated.View style={{ transform: [{ translateX }] }}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Animated.View>
        </Link>
      </TouchableOpacity>
      <Text style={styles.login}>Already have an account? <Link href='/login'>Login</Link></Text>

      {/* Tagline */}
      <Text style={styles.subtitle}>
        the best place to categorise your favourites
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "grey",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: 180,
    position: "absolute",
    top: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  login: {
    color: "#aaa",
    fontSize: 14,
    position: "absolute",
    bottom: 180,  
  },
  subtitle: {
    color: "#aaa",
    fontSize: 12,
    position: "absolute",
    bottom: 100,
  },
});
