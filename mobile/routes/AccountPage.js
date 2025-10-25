import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { UserCircleIcon } from "@hugeicons-pro/core-solid-rounded";

import { useHolos } from "../context/HolosProvider"
import { BandageIcon, HelpCircleIcon, Login01Icon, Settings02Icon } from "@hugeicons-pro/core-stroke-rounded";

export default function AccountPage() {
  const { user } = useHolos()

  const options = [
    { title: 'My Orders', icon: BandageIcon },
    { title: 'Settings', icon: Settings02Icon },
    { title: 'Help & Support', icon: HelpCircleIcon },
    { title: 'Log Out', icon: Login01Icon }
  ]

  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileSection}>
          <HugeiconsIcon
            icon={UserCircleIcon}
            size={100}
            color="#0ba3ff"
          />
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.inviteFolk}>
          <Text style={styles.inviteText}>Invite your friends and earn credits!</Text>
        </View>

        <View style={styles.profileOptions}>
          {options.map((option, index) => (
            <View
              key={index}
              style={styles.profileRow}
            >
              <HugeiconsIcon
                icon={option.icon}
                size={24}
                color="#222"
              />
              <Text style={styles.profileOptionText}>{option.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',

    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 100,

    alignItems: 'center',
  },

  profileSection: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },

  inviteFolk: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 50,
    width: '90%',
    alignItems: 'center',
  },
  inviteText: {
    fontSize: 16, 
    fontWeight: '500',
    color: '#444'
  },

  profileOptions: {
    marginTop: 50,
    width: '90%',
    gap: 30,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileOptionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
  }
});