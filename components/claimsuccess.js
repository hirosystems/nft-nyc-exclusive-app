import { Text, Center, VStack } from '@chakra-ui/react';

import ListItem from './listitem';

import {
  SUCCESS_TITLE,
  SUCCESS_DESCRIPTION,
  SUCCESS_URL_TITLE,
  SUCCESS_URL_HREF,
  CLAIM_SUCCESS_LABEL,
} from '../lib/constants';

import { getUserAddress } from '../lib/helpers';

export const ClaimSuccess = ({ user, txid }) => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {CLAIM_SUCCESS_LABEL}
        </Text>
        {SUCCESS_TITLE.map((item, idx) => {
          // update stxnft url with user address
          let finalUrl = SUCCESS_URL_HREF[idx];
          if (idx === 0 && user) {
            finalUrl += getUserAddress(user);
          }

          // update explorer url with txid
          if (idx === 1) {
            if (txid.length > 0) {
              // TODO: replace with mainnet
              finalUrl += `${txid}?chain=testnet`;
            } else {
              return;
            }
          }

          return (
            <ListItem
              key={idx}
              title={item}
              desc={SUCCESS_DESCRIPTION[idx]}
              urlTitle={SUCCESS_URL_TITLE[idx]}
              url={finalUrl}
            />
          );
        })}
      </VStack>
    </Center>
  );
};

export default ClaimSuccess;
