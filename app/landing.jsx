import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";

const landing = () => {
    const {userId} = useLocalSearchParams();
    console.log("Landing received userid:", userId);
    const [firstName, setFirstName] = useState("");
    const baseURL = "http://192.168.1.4:4000";

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const res = await fetch(`${baseURL}/api/user/${userId}`,{
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
                const data = await res.json();
                if (res.ok) {
                setFirstName(data.firstname);
                } else {
                console.error(data.error);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUserName();
    }, []);
  return (
    <View style={styles.container}>
      {/* TOP NAVBAR */}
      <View style={styles.navbar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Home</Text>

        <View style={{ flexDirection: "row", marginLeft: "auto", gap: 15 }}>
          <TouchableOpacity>
            <Image
              source={require("../assets/add-post.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/search.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        {/* CATEGORY BUTTONS */}
        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text style={styles.categoryText}>Kdramas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryBtn}>
            <Text style={styles.categoryText}>Movies</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryBtn}>
            <Text style={styles.categoryText}>TV Shows</Text>
          </TouchableOpacity>

          <Text style={{ color: "#aaa", marginLeft: 10 }}>more..</Text>
        </View>

        {/* SECTIONS */}
        {renderSection("Kdramas")}
        {renderSection("Movies")}
        {renderSection("TV Shows")}
      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
          <Image source={require("../assets/house.png")} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem}>
          <Image source={require("../assets/person.png")} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>{firstName || "Profile"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// UI for each section
const renderSection = (title) => (
  <View style={{ marginTop: 25 }}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.seeAll}>See All ></Text>
    </View>

    {/* Placeholder cards */}
    <View style={styles.cardRow}>
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={styles.card} />
      ))}
    </View>
  </View>
);

export default landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* NAVBAR */
  navbar: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  logo: { width: 40, height: 40 },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },

  navIcon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },

  /* CATEGORY ROW */
  categoryRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 20,
    alignItems: "center",
  },

  categoryBtn: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
  },

  categoryText: {
    color: "#fff",
    fontSize: 14,
  },

  /* SECTION HEADER */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  seeAll: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
    opacity: 0.6,
  },

  /* CARDS */
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  card: {
    width: "23%",
    height: 140,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },

  /* BOTTOM NAVBAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  bottomItem: {
    alignItems: "center",
  },

  bottomIcon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },

  bottomText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
});
