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

const landing = () => {
    const {userId} = useLocalSearchParams();
    console.log("Landing received userid:", userId);
    const [firstName, setFirstName] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const baseURL = "http://192.168.1.5:4000";
    const [contents, setContents] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [category,setCategory] = useState("");

    const handleCreateCategory = () => {
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch user details
                const userRes = await fetch(`${baseURL}/api/user/${userId}`);
                const userData = await userRes.json();
                if (userRes.ok) setFirstName(userData.firstname);

                // fetch contents
                const contentRes = await fetch(`${baseURL}/api/content/user/${userId}/contents`);
                const data = await contentRes.json();
                console.log("Fetched contents:", data);
                setContents(data.contents);
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchData();
    }, []);

    const getItemsForCategory = (categoryObj) => {
      const items = [];

      categoryObj.genre.forEach(genreObj => {
        if (genreObj.lists) {
          genreObj.lists.forEach(item => items.push({
          ...item,
          genreTitle: genreObj.title,
          genreId: genreObj._id
        }));
        }
      });

      console.log(`Items for category ${categoryObj.category}:`, items);

      return items;
    };


    const handleSearch = () => {
        setShowSearchBar(!showSearchBar);
    }

    const handleAddCategory = async () => {
        if (!category.trim()) return;

        try {
            const res = await fetch(`${baseURL}/api/user/${userId}/create-content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: category,
                    genre: [],        // start empty
                    userId: userId,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setShowCreateModal(false);   // close modal

                // Navigate to Category Page
                console.log("New category ID:", data.content._id);
                router.push(`/category/${category}?userId=${userId}&firstName=${firstName}&categoryId=${data.content._id}`);
            } else {
                console.log("Error:", data.error);
            }
        } catch (err) {
            console.log("Failed to add category", err);
        }
    };
  return (
    <View style={styles.container}>
      {/* TOP NAVBAR */}
      <View style={styles.navbar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Home</Text>

        <View style={{ flexDirection: "row", marginLeft: "auto", gap: 15 }}>
          <TouchableOpacity onPress={handleCreateCategory}>
            <Image
              source={require("../assets/add-post.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSearch}>
            <Image
              source={require("../assets/search.png")}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showSearchBar && (
        <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
            <TextInput
            placeholder="Search category..."
            placeholderTextColor="#999"
            style={{
                backgroundColor: "#111",
                color: "#fff",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#444",
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
        </View>
        )}

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        {/* CATEGORY BUTTONS */}
      

        {showCreateModal &&  (
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add New Category</Text>

            <TextInput
                placeholder="Enter category..."
                placeholderTextColor="#aaa"
                style={styles.modalInput}
                value={category}
                onChangeText={setCategory}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={handleAddCategory} >
                <Text style={styles.modalBtnText}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal}>
                <Text style={{ color: "#fff", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </View>
        )}
        <TouchableOpacity style={styles.categoryBtn} onPress={()=>{router.push(`/item/Harry Potter?userId=${userId}&firstName=${firstName}&category=E&categoryId=69384523888db778acacff28&genre=e&genreId=69384531888db778acacff2a&itemId=693adfd7c89b9479df17e126`)}}>
            <Text style={styles.categoryText}>Test button</Text>
        </TouchableOpacity>

        {/* CONTENT SECTIONS */}
        {Array.isArray(contents) && contents.map(category => {
        const items = getItemsForCategory(category);

        return (
          <View key={category._id} style={{ marginBottom: 30 }}>
            
            {/* Category Title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              <TouchableOpacity onPress={() => router.push(`/category/${category.category}?userId=${userId}&firstName=${firstName}&categoryId=${category._id}`)}>
                <Text style={styles.seeAllText}>See All ></Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Scroll of Items */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {items.map(item => (
                <TouchableOpacity 
                  key={item._id}
                  onPress={() => router.push(`/item/${item.title}?userId=${userId}&firstName=${firstName}&category=${category.category}&categoryId=${category._id}&genre=${item.genreTitle}&genreId=${item.genreId}&itemId=${item._id}`)}  
                >
                  <Image 
                    source={{ uri: item.itemImageUrl }} 
                    style={styles.itemImage}
                  />
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

          </View>
        );
      })}

      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem} onPress={() => {router.push("/landing")}}>
          <Image source={require("../assets/house.png")} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem} onPress={() => {router.push("/profile")}}>
          <Image source={require("../assets/person.png")} style={styles.bottomIcon} />
          <Text style={styles.bottomText}>{firstName || "Profile"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  categoryTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  seeAllText: {
    color: "white",
    opacity: 0.7,
    fontWeight: "500",
  },

  itemImage: {
    width: 130,
    height: 180,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#444",
  },
});
