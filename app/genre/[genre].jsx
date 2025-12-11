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
  const { categoryId,category,firstName, userId,genre,genreId } = useLocalSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [item,setItem] = useState("");
  const baseURL = "http://192.168.1.5:4000";
  const [toggle,setToggle] = useState("Search");
  const [itemData, setItemData] = useState({
    title: "",
    content: "",
    imageUrl: ""
    });
    const [loadingGemini, setLoadingGemini] = useState(false);

    const fetchGeminiData = async () => {
      console.log("Fetching Gemini data for item:", item);
  if (!item.trim()) return;

  try {
    setLoadingGemini(true);

    const prompt = `
      Give a short summary and image URL for: ${item}.
      The image should be book cover if its a book, poster if its a movie or TV show, album cover if its music, etc.
      Return only publicly accessible image URLs from open websites.
      Return JSON in this exact format:
      {
        "title": "",
        "content": "",
        "imageUrl": ""
      }
      Only return the JSON object and nothing else.
    `;

    const res = await fetch(`${baseURL}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // text returned by backend
    const text = data.text;

    // Extract JSON from text
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    console.log("Gemini returned JSON:", json);

    setItemData(json);
    setToggle("Add Item");

  } catch (err) {
    console.log("Gemini fetch error:", err);
  } finally {
    setLoadingGemini(false);
  }
};


  const handleCreateItem = () => {
        setShowCreateModal(true);
    };
  const closeModal = () => {
        setItem("");
        setToggle("Search");
        setItemData({
          title: "",
          content: "",
          imageUrl: ""
          });
        setShowCreateModal(false);
    };
  const handleAddItem = async () => {
  if (!itemData.title.trim()) return;

  try {
    const res = await fetch(`${baseURL}/api/content/${categoryId}/${genreId}/add-item`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: itemData.title,
        content: itemData.content,
        imageUrl: itemData.imageUrl
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setShowCreateModal(false);
      setItem(""); // reset input
      setItemData({ title: "", content: "", imageUrl: "" });
      setToggle("Search");
      console.log("Item added successfully:", data);
      console.log(itemData.title);
      router.push(`/item/${itemData.title}?userId=${userId}&firstName=${firstName}&category=${category}&categoryId=${categoryId}&genre=${genre}&genreId=${genreId}&itemId=${data._id}`);
    } else {
      console.log("Error:", data.error);
    }
  } catch (err) {
    console.log("Failed to add item", err);
  }
};

  return (
    <View style={styles.container}>
          {/* TOP NAVBAR */}
          <View style={styles.navbar}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>{category}/{genre}</Text>
    
            <View style={{ flexDirection: "row", marginLeft: "auto", gap: 15 }}>
              <TouchableOpacity onPress={handleCreateItem}>
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
                <Text style={styles.modalTitle}>Add New Item</Text>
    
                <TextInput
                    placeholder="Enter item..."
                    placeholderTextColor="#aaa"
                    style={styles.modalInput}
                    value={item}
                    onChangeText={setItem}
                />

                {/* GEMINI PREVIEW INSIDE MODAL */}
                {itemData.title !== "" && (
                  <View style={styles.previewBox}>
                    <Image
                      source={{ uri: itemData.imageUrl }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.previewTitle}>{itemData.title}</Text>
                      <Text
                        style={styles.previewContent}
                        numberOfLines={1} // single line with ellipsis
                        ellipsizeMode="tail"
                      >
                        {itemData.content}
                      </Text>
                    </View>
                  </View>
                )}

    
                <TouchableOpacity
                style={styles.modalBtn}
                onPress={toggle === "Search" ? fetchGeminiData : handleAddItem}
                >
                <Text style={styles.modalBtnText}>{toggle}</Text>
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

previewBox: {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.12)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)",
  padding: 10,
  marginBottom: 15,
  flexDirection: "row",
  alignItems: "center",
},

previewImage: {
  width: 60,
  height: 60,
  borderRadius: 10,
  backgroundColor: "#222",
},

previewTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#fff",
},

previewContent: {
  color: "#ccc",
  marginTop: 4,
  fontSize: 13,
}
});
