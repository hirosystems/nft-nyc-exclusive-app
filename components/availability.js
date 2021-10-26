import { Tag } from "@chakra-ui/react";

export const Availability = ({ claimed, count }) => {
  return (
    <div>
      {claimed && (
        <Tag position="absolute" top="475px" right="37%" colorScheme="green">
          {`Congrats! You got one of only 100 NFTs`}
        </Tag>
      )}
      {!claimed && (
        <Tag position="absolute" top="475px" right="37%" className="claimTag">
          {`${count} / 1,000 claimed`}
        </Tag>
      )}
    </div>
  );
};

export default Availability;
