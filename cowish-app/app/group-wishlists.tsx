// app/groups/index.tsx
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Text,
} from "react-native";
import { useRef, useState, useMemo, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GroupWithCount } from "@/interface";
import getUserGroup from "@/components/getUserGroup";
import { useUser } from "./_layout";
import getGroupByIds from "@/components/getGroupByIds";
import imageMap from "@/assets/imageMap";
import createGroup from "@/components/createGroup";

const { width } = Dimensions.get("window");

export default function GroupListPage() {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const {userAcc, setUserAcc}= useUser();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedPic, setSelectedPic] = useState(Object.keys(imageMap)[0]);
  const [yourGroups, setYourGroups] = useState<GroupWithCount[]|[]>([]);
  const [groupIds, setGroupIds] = useState<string[]|[]>([])
  const [creatingGroup,setCreatingGroup] = useState(false)
  let count =0
  const fetchGroups = async(): Promise<GroupWithCount[]|[]>=>{
    count+=1
    const ids = await getUserGroup(userAcc?.uuid??'',setGroupIds)
    if(ids && ids.length>0){
      const groups = await getGroupByIds(ids,setYourGroups)
      return groups
    }
    return []
  }
  useEffect(()=> {
    fetchGroups()
  },[userAcc])
  console.log(count)
  console.log("id",groupIds)
  console.log("group",yourGroups)

  const dynamic = useMemo(
    () => ({
      background: isDark ? "#000" : "#f8f8f8",
      card: isDark ? "#1e1e1e" : "#fff",
      textPrimary: isDark ? "#fff" : "#1a1a1a",
      textSecondary: isDark ? "#aaa" : "#555",
      buttonGradient: isDark
        ? ["#7047eb", "#4F46E5", "#3832a8"]
        : ["#6366F1", "#4F46E5", "#4338CA"],
    }),
    [isDark]
  );

  const renderGroup = ({ item }: { item: GroupWithCount }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/group/[id]',
        params: {id: item.id}
      })}
      style={[styles.card, { backgroundColor: dynamic.card }]}
    >
      <Image source={item && item.profile_pic ? imageMap[item.profile_pic]||require('@/assets/images/default.jpg'):require('@/assets/images/default.jpg')} style={styles.avatar}/>
      <View style={styles.textBlock}>
        <ThemedText style={[styles.groupName, { color: dynamic.textPrimary }]}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.meta, { color: dynamic.textSecondary }]}>
          code {item.id} • {item.member_count} members
        </ThemedText>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={dynamic.textSecondary}
      />
    </TouchableOpacity>
  );
  if(!yourGroups.length){
    return <ThemedText>Loading...</ThemedText>
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: dynamic.background }]}
    >
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <View style={styles.avatarSelection}>
              {Object.keys(imageMap).map((pic) => (
                <TouchableOpacity key={pic} onPress={() => setSelectedPic(pic)}>
                  <Image
                    source={imageMap[pic]}
                    style={[
                      styles.modalAvatar,
                      selectedPic === pic && {
                        borderWidth: 2,
                        borderColor: "#4F46E5",
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter group name"
              placeholderTextColor="#aaa"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#333" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#4F46E5" }]}
                onPress={async () => {
                  if (groupName.trim() !== "") {
                    setCreatingGroup(true);
                    try{
                      const data = await createGroup(groupName,selectedPic,userAcc?.uuid ?? '')
                      await new Promise((res) => setTimeout(res, 300));
                      const newGroups = await fetchGroups()
                      setYourGroups(newGroups)
                    }catch(error){
                      console.error("error: ",error)
                    }finally{
                      setModalVisible(false);
                      setGroupName("");
                      setCreatingGroup(false)
                    }
                  }else{
                    setModalVisible(false);
                    setGroupName("");
                  }
                }}
                disabled = {creatingGroup}
              >
                <Text style={{ color: "#fff" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ThemedText type="title" style={styles.title}>
        Your Groups
      </ThemedText>
      <FlatList
        data={yourGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 1000);
        }}
        refreshing={refreshing}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={dynamic.buttonGradient as [string, string, string]}
            style={styles.button}
          >
            <Ionicons
              name="add"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <ThemedText style={styles.buttonText}>Create New Group</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    marginTop: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  textBlock: { flex: 1 },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: { fontSize: 13 },
  buttonWrapper: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  avatarSelection: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 6,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
});

/*const presetPics = [
  "https://i.pravatar.cc/100?img=8",
  "https://i.pravatar.cc/100?img=23",
  "https://i.pravatar.cc/100?img=42",
  "https://i.pravatar.cc/100?img=60",
  "https://i.pravatar.cc/100?img=5",
];*/

  /*const [groups, setGroups] = useState([
    {
      id: "g123456",
      name: "Camping Crew",
      profile_pic: "https://i.pravatar.cc/100?img=8",
      memberCount: 8,
      code: "g123456",
    },
    {
      id: "g654321",
      name: "Office Buddies",
      profile_pic: "https://i.pravatar.cc/100?img=23",
      memberCount: 12,
      code: "g654321",
    },
    {
      id: "g999999",
      name: "Birthday Squad",
      profile_pic: "https://i.pravatar.cc/100?img=42",
      memberCount: 6,
      code: "g999999",
    },
    {
      id: "g888888",
      name: "Travel Planners",
      profile_pic: "https://i.pravatar.cc/100?img=60",
      memberCount: 5,
      code: "g888888",
    },
  ]);*/
