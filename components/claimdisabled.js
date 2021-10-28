import {
  Text,
  Link,
  Center,
  VStack,
  Icon,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { SiTwitter, SiDiscord } from "react-icons/si";
import { MdOutlineEmail } from "react-icons/md";

import {
  CLAIM_COMPLETE_TEXT,
  CLAIM_COMPLETE_TITLE,
  CLAIM_DEVELOPER_LINK_TEXT,
  CLAIM_DEVELOPER_LINK_URL,
  CLAIM_DEVELOPER_CTA,
  HIRO_SOCIAL_URLS,
} from "../lib/constants";

export const ClaimDisabled = () => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {CLAIM_COMPLETE_TITLE}
        </Text>
        <Text className="subText" p={2} textAlign="center">
          {CLAIM_COMPLETE_TEXT}
        </Text>
        <AvatarGroup spacing="1rem" p={4}>
          <Avatar
            className="socialIcon"
            icon={
              <Icon
                as={SiTwitter}
                color="gray.600"
                onClick={() => window.open(HIRO_SOCIAL_URLS[0], "_blank")}
              />
            }
          />
          <Avatar
            className="socialIcon"
            icon={
              <Icon
                as={SiDiscord}
                color="gray.600"
                onClick={() => window.open(HIRO_SOCIAL_URLS[1], "_blank")}
              />
            }
          />
          <Avatar
            className="socialIcon"
            icon={
              <Icon
                as={MdOutlineEmail}
                color="gray.600"
                onClick={() => window.open(HIRO_SOCIAL_URLS[2], "_blank")}
              />
            }
          />
        </AvatarGroup>
        <Text className="subText" py={2}>
          {CLAIM_DEVELOPER_CTA}{" "}
          <Link href={CLAIM_DEVELOPER_LINK_URL} color="purple.700" isExternal>
            {CLAIM_DEVELOPER_LINK_TEXT}
          </Link>
        </Text>
      </VStack>
    </Center>
  );
};

export default ClaimDisabled;
