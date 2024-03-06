import OBSWebSocket from "obs-websocket-js"
import { useCallback, useEffect, useRef, useState } from "react"


interface ObsWebsocketParams {
	enabled?: boolean
	url?: string
	password?: string
}

const obs = new OBSWebSocket();

export function useObsWebsocket({ url, password, enabled }: ObsWebsocketParams) {
    const [isConnected, setIsConnected] = useState<boolean>(false);

	const connecting = useRef<boolean>(false);
	const shouldConnect = useRef<boolean>(false);

	const connect = useCallback(()=>{
		connecting.current = true;
		obs.connect(url, password)
			.then(()=>{
				setIsConnected(true);
			})
			.catch(e=>{
				console.error('Error connecting OBS websocket',e);
				setIsConnected(false);
				if(shouldConnect.current) {
					connect();
				}
			})
			.finally(()=>{
				connecting.current = false;
				shouldConnect.current = false;
			});
	}, [password, url]);

	const refresh = useCallback(()=>{
		if(url && password && enabled) {
			if(!connecting.current) {
				connect();
			}else{
				shouldConnect.current = true;
			}
		}
	}, [connect, enabled, password, url]);

	useEffect(()=>{
		refresh();

		return ()=>{
			shouldConnect.current = false;
			obs.disconnect()
				.then(()=>{
					setIsConnected(false);
				})
				.catch(e=>console.error('Error disconnecting OBS websocket',e));
		}

	}, [connect, refresh]);

	return {
		obs,
		isConnected,
		refresh
	};
}