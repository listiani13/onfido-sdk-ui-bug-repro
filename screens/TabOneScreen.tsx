import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import type { SdkHandle, SdkInitMethod, SdkOptions } from "onfido-sdk-ui";
let onfidoWebSdk: SdkHandle | undefined;

// TODO: Change user token
const TOKEN = "user-token";
export default function TabOneScreen({
	navigation,
}: RootTabScreenProps<"TabOne">) {
	const onPress = async () => {
		const { init } = (await require("onfido-sdk-ui")) as {
			init: SdkInitMethod;
		};

		onfidoWebSdk = init({
			useModal: true,
			containerId: "idv-modal",
			isModalOpen: true,
			// We need to set `useMemoryHistory` to true so when we press the back button within the SDK, it doesn't mess up with the browser's history
			// See SDK navigation issues section in https://www.npmjs.com/package/onfido-sdk-ui
			useMemoryHistory: true,
			shouldCloseOnOverlayClick: true,
			steps: [
				{
					type: "document",
					options: {
						documentTypes: {
							driving_licence: {
								country: "AUS",
							},

							passport: {
								country: "AUS",
							},
						},
						/**
						 * This forces user to capture using their phone. The reason is:
						 * - We haven't been approved for upload capabilities per Jack Li's statement on 15 June. (I assumed this was talking about Risk approval)
						 * - We can't turn off upload capabilities on desktop in Onfido SDK, this is a fallback for when user doesn't have webcam on their desktop device
						 */
						forceCrossDevice: true,
					},
				},
				{ type: "face" },
			],
			token: TOKEN,
			onModalRequestClose() {
				onfidoWebSdk?.setOptions({ isModalOpen: false });
				onfidoWebSdk?.tearDown();
			},
			onComplete: () => {
				console.log("onComplete and do nothing");

				onfidoWebSdk?.setOptions({ isModalOpen: false });
				console.log("trying to teardown", onfidoWebSdk?.tearDown);
				onfidoWebSdk?.tearDown();
			},
			onUserExit() {
				onfidoWebSdk?.setOptions({ isModalOpen: false });
				onfidoWebSdk?.tearDown();
			},
		});
	};
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>
			<EditScreenInfo path="/screens/TabOneScreen.tsx" />
			<Button title="Initiate onfido" onPress={onPress} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
