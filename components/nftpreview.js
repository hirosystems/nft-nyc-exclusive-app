import { Center } from "@chakra-ui/react";
import Availability from "./availability";

export const NFTPreview = ({ claimed, count }) => {
  return (
    <Center borderWidth="1px" borderRadius="16px" borderColor="#EFEFF2" p={6}>
      <video
        width="421px"
        height="100%"
        src="nft-preview.webm"
        type="video/webm"
        preload="true"
        autoPlay
        loop
        muted
      />
      <Availability claimed={claimed} count={count} />
    </Center>
  );
};

export default NFTPreview;
