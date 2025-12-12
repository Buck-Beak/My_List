import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

export default function ItemDetails(){
    const { itemTitle, userId,firstName,category,categoryId,genre,genreId,itemId } = useLocalSearchParams(); 
    console.log("item id",itemId)
    const baseURL = "http://192.168.1.5:4000";
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${baseURL}/api/content/${categoryId}/${genreId}/item/${itemId}`);
        const data = await res.json();
        console.log("Fetched item data:", data);
        setItemData(data);
      } catch (err) {
        console.log("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, []);

  if (loading) return <Text style={{ color: "#fff" }}>Loading...</Text>;

  if (!itemData) return <Text style={{ color: "#fff" }}>Item not found</Text>;
    return (
        <View style={styles.container}>
              {/* TOP NAVBAR */}
              <View style={styles.navbar}>
                <Image source={require("../../assets/logo.png")} style={styles.logo} />
                <Text style={styles.title}>{category}/{genre}/{itemData.title}</Text>
              </View>

              {/* ITEM DETAILS */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {itemData.imageUrl ? (
                <Image source={{ uri: itemData.imageUrl }} style={{ width: "100%", height: 250, borderRadius: 10, marginBottom: 15 }} />
                ) : null}
                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 10 }}>{itemData.title}</Text>
                <Text style={{ color: "#ccc", fontSize: 16 }}>{itemData.content}</Text>
            </ScrollView>


              {/* BOTTOM NAVBAR */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomItem} onPress={() => {router.push(`/landing?userId=${userId}`)}}>
                <Image source={require("../../assets/house.png")} style={styles.bottomIcon} />
                <Text style={styles.bottomText}>Home</Text>
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.bottomItem} onPress={() => {router.push("/profile")}}>
                <Image source={require("../../assets/person.png")} style={styles.bottomIcon} />
                <Text style={styles.bottomText}>{firstName || "Profile"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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