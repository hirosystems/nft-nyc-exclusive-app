import { Text, GridItem, Button, Divider, Grid } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export const ListItem = ({ title, desc, url, urlTitle }) => {
  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" my={4}>
        <GridItem colSpan={2}>
          <Text className="claimCTATitle">{title}</Text>
          <Text mt={4} className="claimCTADescription">
            {desc}
          </Text>
        </GridItem>
        <GridItem colStart={3} colEnd={4} textAlign="right">
          <Button
            className="secondaryButton"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => {
              window.open(url, "_blank");
            }}
          >
            {urlTitle}
          </Button>
        </GridItem>
      </Grid>
      <Divider />
    </div>
  );
};

export default ListItem;
