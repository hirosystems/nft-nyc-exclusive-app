import { Center, Image } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Center>
      <Image
        boxSize="88px"
        objectFit="contain"
        src="hiro-logo.png"
        alt="Hiro Systems PBC"
      />
    </Center>
  );
};

export default Header;
