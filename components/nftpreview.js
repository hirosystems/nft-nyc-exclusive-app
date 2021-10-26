import { Center, Image } from "@chakra-ui/react";
import Availability from "./availability";

export const NFTPreview = ({ claimed, count }) => {
  return (
    <Center borderWidth="1px" borderRadius="16px" borderColor="#EFEFF2" p={6}>
      <Image
        boxSize="421px"
        objectFit="contain"
        src="nft-preview.png"
        alt="Special NFT.NYC NFT from Hiro Systems PBC"
      />
      <Availability claimed={claimed} count={count} />
    </Center>
  );
};

export default NFTPreview;
