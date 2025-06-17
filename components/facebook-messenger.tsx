'use client'
import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMessenger = () => {
	return (
		<FacebookProvider appId="581157280804465" chatSupport>
			<CustomChat pageId="174241062434285" minimized />
		</FacebookProvider>
	);
};

export default FacebookMessenger;
