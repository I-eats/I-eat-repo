import { memo, useEffect, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Image } from "expo-image"

import { checkIfFileExistsWithPath, downloadFileWithPath, getLocalUriForFile } from "../../util/db-store"

const Avatar = memo(({
  imagePath,
  type = "profile",
  style
}) => {

  const [avatarPath, setAvatarPath] = useState(getLocalUriForFile(imagePath))
  const [avatarDownloaded, setAvatarDownloaded] = useState(null)
  const [downloadRequired, setDownloadRequired] = useState(false)

  useEffect(() => {
    const avatarAllocation = async () => {
      try {
        const avatar = await checkIfFileExistsWithPath(imagePath)
        const fileUri = getLocalUriForFile(imagePath)

        if (avatar.exists === true) {
          setAvatarPath({ uri: fileUri })
          setAvatarDownloaded(true)
        } else if (avatar.exists === false) {
          setDownloadRequired(true)
          const { uri, error } = await downloadFileWithPath('bucket', `/${type}/`, fileUri.split("/").pop())
          if (!error) {
            // image is downloaded correctly.
            // wait for the image to be recognizable by the system
            // 10 seconds has been alloted here
            let iterations = [0, 100]
            const intervalId = setInterval(async () => {
              if (iterations[0] <= iterations[1]) {
                const { exists } = await checkIfFileExistsWithPath(uri);
                if (exists) {
                  clearInterval(intervalId);
                  setAvatarPath({ uri: fileUri });
                  setAvatarDownloaded(true);
                }
                iterations[0] += 1;
              } else {
                clearInterval(intervalId);
                console.error("Error downloading avatar, ITERATED OUT");
              }
            }, 100);
          } else {
            console.error("Error downloading avatar", error);
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (imagePath) {
      setAvatarDownloaded(false)
      avatarAllocation()
    } else {
      setAvatarDownloaded(true)
      setAvatarPath(null)
    }
  }, [imagePath])

  return (
    <View style={[styles.avatarBox, style]}>
      {avatarDownloaded && (
        <Image
          source={avatarPath}
          style={[styles.avatar, style]}
          cachePolicy="memory-disk"
        />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  avatarBox: {
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  avatar: {

  }
})

export default Avatar