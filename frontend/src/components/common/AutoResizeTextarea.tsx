import { Textarea, TextareaProps } from "@chakra-ui/react";
import { FC } from "react";
import ResizeTextarea from "react-textarea-autosize";

export const AutoResizeTextarea: FC<TextareaProps> = (props) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      fontSize="md"
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  );
};
