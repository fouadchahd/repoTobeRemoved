import 'react-native-gesture-handler';
import React,{useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,I18nManager,Platform ,Alert} from 'react-native';
import Home from './screens/Home';
import Settings from './screens/Settings';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator()
//I18nManager.forceRTL(true)
//I18nManager.allowRTL(true)
export default function App() {
  const registerForPushNotifications = async (): Promise<void> => {		
    try{
					const { status: existingStatus } = await Notifications.getPermissionsAsync()
					let finalStatus = existingStatus
					if (existingStatus != "granted") {
						const { status } = await Notifications.requestPermissionsAsync()
						finalStatus = status
					}
					if (finalStatus != "granted") {
						Alert.alert(
							"alert.permissionDeniedTitle",
							"alert.permissionDeniedContent",
							[
								{
									text: "alert.cancelButton",
								},
								{
									text: "alert.enableNotificationButton",
									onPress: async (): Promise<void | true> => {
										Platform.OS === "ios"
											? Linking.openURL("app-settings:")
											: Linking.openSettings()
									},
								},
							]
						)

						return
					}
					const vtoken = (await Notifications.getExpoPushTokenAsync()).data
					const vnativeToken = (await Notifications.getDevicePushTokenAsync()).data
          console.log("Expo Token= ",vtoken)
          console.log("NAtive Token= ",vnativeToken)
					if (Platform.OS === "android") {
						Notifications.setNotificationChannelAsync("default", {
							name: "default",
							importance: Notifications.AndroidImportance.MAX,
							vibrationPattern: [0, 250, 250, 250],
							lightColor: "#FF231F7C",
						})
					}		
        }catch(err){
          console.log("err",err)
        }
		}
	useEffect(() => {
   registerForPushNotifications() 
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
