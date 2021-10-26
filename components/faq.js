import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const faqTitles = [
  "Why do I need a wallet?",
  "Why do I need STX tokens?",
  "How do I mint the NFT?",
  "How do I view my NFT?",
];
const faqAnswers = [
  "In order to receive an NFT on Stacks, you must have a Stacks wallet. We recommend the Hiro Wallet for web (Chrome, Brave or Firefox).",
  "You will need to pay a small gas fee to receive your NFT (< 1 STX). The gas token of the Stacks blockchain is the STX token. Learn more about how to obtain STX at StacksToken.com.",
  "Click the 'Mint' button to receive your NFT! Review the transaction in your wallet and click Accept to mint your token.",
  "You can view your NFT at STXNFT.com. Enter your Stacks address and the site will display all NFTs owned by the account.",
];

export const FAQ = () => {
  return (
    <div>
      <Text className="faqHeader" textAlign="left" px={2} py={6}>
        FAQ
      </Text>
      <Accordion allowMultiple>
        {faqTitles.map((title, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{faqAnswers[index]}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
