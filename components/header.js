import { Grid, GridItem, Image, Center } from '@chakra-ui/react';
import { useAuth } from 'micro-stacks/react';
import DisconnectButton from './disconnectButton';

export const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <Grid templateColumns="repeat(5, 1fr)">
      <GridItem colSpan={1} width="150px" />
      <GridItem colSpan={3}>
        <Center>
          <Image boxSize="88px" objectFit="contain" src="hiro-logo.png" alt="Hiro Systems PBC" />
        </Center>
      </GridItem>
      <GridItem colSpan={1} width="150px" alignSelf="center">
        {isSignedIn && <DisconnectButton />}
      </GridItem>
    </Grid>
  );
};

export default Header;
