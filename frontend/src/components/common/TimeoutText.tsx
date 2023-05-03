import React, { useState, useEffect, FC } from "react";
import { Text } from "@chakra-ui/react";

type TimeoutTextProps = {
  baseText: string;
  timeoutText: string;
  trigger: number;
};

export const TimeoutText: FC<TimeoutTextProps> = ({
  baseText,
  timeoutText,
  trigger,
}) => {
  const [text, setText] = useState(baseText);
  const [timeoutId, setTimeoutId] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  useEffect(() => {
    if (trigger === 0) {
      return;
    }
    setText(timeoutText);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setText(baseText);
      setTimeoutId(undefined);
    }, 3000);

    setTimeoutId(newTimeoutId);
  }, [trigger]);

  return (
    <Text color="gray.600" fontSize="md">
      {text}
    </Text>
  );
};
