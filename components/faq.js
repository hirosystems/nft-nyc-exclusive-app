import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

import { FAQ_TITLES, FAQ_ANSWERS } from "../lib/constants";

export const FAQ = () => {
  return (
    <div>
      <Text className="faqHeader" textAlign="left" px={4} pt={10} pb={6}>
        FAQ
      </Text>
      <Accordion allowMultiple>
        {FAQ_TITLES.map((title, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{FAQ_ANSWERS[index]}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
