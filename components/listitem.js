import {
  Text,
  Box,
  Heading,
  Button,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export const ListItem = ({ title, desc, url, urlTitle }) => {
  return (
    <div>
      <SimpleGrid columns={2} spacing={10}>
        <Box p={5}>
          <Heading fontSize="xl">{title}</Heading>
          <Text mt={4}>{desc}</Text>
        </Box>
        <Box p={5}>
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={() => {
              window.open(url, "_blank");
            }}
          >
            {urlTitle}
          </Button>
        </Box>
      </SimpleGrid>
      <Divider />
    </div>
  );
};

export default ListItem;
