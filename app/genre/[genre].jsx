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

export default function GenrePage() {
  const { categoryId,category,firstName, userId } = useLocalSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [genre,setGenre] = useState("");
  const baseURL = "http://192.168.1.4:4000";

  const handleCreateGenre = () => {
        setShowCreateModal(true);
    };
  const closeModal = () => {
        setShowCreateModal(false);
    };
  const handleAddGenre = async () => {
  if (!genre.trim()) return;

  try {
    const res = await fetch(`${baseURL}/api/content/${categoryId}/add-genre`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre }),
    });

    const data = await res.json();

    if (res.ok) {
      setShowCreateModal(false);

      router.push(
        `/genre/${genre}?userId=${userId}&firstName=${firstName}&category=${category}&categoryId=${categoryId}`
      );
    } else {
      console.log("Error:", data.error);
    }
  } catch (err) {
    console.log("Failed to add genre", err);
  }
};
  return (
    <View style={styles.container}>
          {/* TOP NAVBAR */}
          <View style={styles.navbar}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>{category}</Text>
    
            <View style={{ flexDirection: "row", marginLeft: "auto", gap: 15 }}>
              <TouchableOpacity onPress={handleCreateGenre}>
                <Image
                  source={require("../../assets/add-post.png")}
                  style={styles.navIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity >
                <Image
                  source={require("../../assets/search.png")}
                  style={styles.navIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {showCreateModal &&  (
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Add New Genre</Text>
    
                <TextInput
                    placeholder="Enter genre..."
                    placeholderTextColor="#aaa"
                    style={styles.modalInput}
                    value={genre}
                    onChangeText={setGenre}
                />
    
                <TouchableOpacity style={styles.modalBtn} onPress={handleAddGenre} >
                    <Text style={styles.modalBtnText}>Add Genre</Text>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={closeModal}>
                    <Text style={{ color: "#fff", marginTop: 10 }}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}

          {/* BOTTOM NAVBAR */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.bottomItem} onPress={() => {router.push("/landing")}}>
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
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)", // dark overlay
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  zIndex: 999,
},

modalBox: {
  width: "100%",
  padding: 20,
  borderRadius: 20,

  // glass effect (no blur)
  backgroundColor: "rgba(255,255,255,0.12)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)",

  shadowColor: "#000",
  shadowOpacity: 0.4,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
  alignItems: "center",
},

modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#fff",
  marginBottom: 20,
},

modalInput: {
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  borderWidth: 1,
  borderColor: "#555",
  borderRadius: 10,
  padding: 12,
  color: "#fff",
  marginBottom: 20,
},

modalBtn: {
  backgroundColor: "#fff",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginTop: 10,
},

modalBtnText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#000",
},
});
