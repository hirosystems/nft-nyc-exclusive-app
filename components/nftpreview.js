import { Center, Image } from '@chakra-ui/react';
import Availability from './availability';

export const NFTPreview = ({ claimed, count, mobile }) => {
  return (
    <Center borderWidth="1px" borderRadius="16px" borderColor="#EFEFF2" p={4}>
      {mobile ? (
        <Image className={`nft-video ${claimed ? 'nft-claimed' : ''}`} src="nft-preview.png" />
      ) : (
        <video
          className={`nft-video ${claimed ? 'nft-claimed' : ''}`}
          src="nft-preview.webm"
          type="video/webm"
          preload="true"
          autoPlay
          loop
          muted
        />
      )}
      <Availability claimed={claimed} count={count} />
    </Center>
  );
};

export default NFTPreview;
