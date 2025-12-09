import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CategoryPage() {
  const { category, userId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
        {category}
      </Text>
    </View>
  );
}
