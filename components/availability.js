import { Tag } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export const Availability = ({ claimed, count }) => {
  return (
    <div className={`availableWrapper ${claimed ? "tag-claimed" : ""}`}>
      {claimed && (
        <Tag className="claimTag">
          <CheckCircleIcon pr={2} w={6} h={6} color="green.400" /> {`Claimed`}
        </Tag>
      )}
      {!claimed && <Tag className="claimTag">{`${count} / 1000 claimed`}</Tag>}
    </div>
  );
};

export default Availability;
