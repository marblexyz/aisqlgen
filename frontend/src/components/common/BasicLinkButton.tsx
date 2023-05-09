import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

export type BasicLinkButtonProps = ButtonProps & {
  onClick?: () => void;
  isDisabled?: boolean;
  children: ReactNode;
};

export const BasicLinkButton: FC<BasicLinkButtonProps> = ({
  onClick,
  isDisabled,
  children,
  // We shouldn't really need to do this, but Chakra internal types are a pain to export
  ...rest
}) => {
  return (
    <Button
      variant={"unstyled"}
      isDisabled={isDisabled}
      h={8}
      fontWeight={"normal"}
      color={"gray.900"}
      borderRadius={"sm"}
      fontSize={"sm"}
      _hover={{
        bg: "gray.50",
      }}
      _active={{
        bg: "gray.50",
      }}
      px={2}
      _disabled={{
        color: "gray.400",
        bg: "none ",
        cursor: "not-allowed",
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
