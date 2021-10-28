import {
  Center,
  VStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

export const SkeletonView = () => {
  return (
    <Center>
      <VStack>
        <Skeleton width="440px" height="40px" mt="8" />
        <SkeletonText width="440px" pt="4" noOfLines={4} spacing="6" />
      </VStack>
    </Center>
  );
};

export default SkeletonView;
