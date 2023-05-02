import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

export type BasicButtonProps = ButtonProps & {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
};

export const BasicButton: FC<BasicButtonProps> = ({
  onClick,
  disabled,
  children,
  // We shouldn't really need to do this, but Chakra internal types are a pain to export
  ...rest
}) => {
  return (
    <Button
      variant={"unstyled"}
      isDisabled={disabled}
      h={8}
      color={"gray.900"}
      fontWeight={"light"}
      bg={"gray.200"}
      borderRadius={"none"}
      px={4}
      fontSize={"sm"}
      _hover={{
        bg: "gray.300",
      }}
      _active={{
        bg: "gray.300",
      }}
      _disabled={{
        bgColor: "gray.600",
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
